import voiceDictationHttp from 'api/voice-dictation';
import ModalSheet from 'components/modalSheet';
import OverlayModal from 'components/overlay-modal';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';
import { changeFileExtension, formatMilliseconds } from 'util/getAudioDuration';

import {
  useVoiceDictationContext,
  VoiceDictationResult
} from '../../provider/voice-dictation-provider';
import VoiceFileModalContent from '../voice-file-modal-content';

import * as S from './style';

interface Props {
  isOpened: boolean;
  setIsOpened: (isOpen: boolean) => void;
}

export default function VoiceSaveBottomSheet({ isOpened, setIsOpened }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    sharedVoiceDictationInfo: { voiceDictationResult, fileName }
  } = useVoiceDictationContext();

  const handleDownloadVoiceFile = async () => {
    overlay.closeAll();

    dispatch(activeLoadingSpinner());
    await Bridge.callBridgeApi('downloadVoiceFile', {
      fileName,
      url: voiceDictationResult?.data.voiceUrl
    });
  };

  const parseJsonToText = (): string => {
    // 1. segments를 시간순으로 정렬
    const sortedSegments = [...voiceDictationResult!.data.segments].sort((a, b) => a.end - b.end);

    // 2. 각 segment를 포맷팅된 문자열로 변환
    const formattedText = sortedSegments
      .map((segment) => {
        const speaker = `참석자 ${segment.speaker.name}`;
        const endTime = formatMilliseconds(segment.end);
        const text = segment.text.trim();

        return `[${speaker}] ${endTime}\n${text}\n`;
      })
      .join('\n');

    return formattedText;
  };

  const convertJsonToTxt = () => {
    const text = parseJsonToText();

    const file = new File([text], fileName, {
      type: 'text/plain;charset=utf-8'
    });

    return file;
  };

  const handleDownloadScriptFile = async (type: 'txt' | 'pdf') => {
    dispatch(activeLoadingSpinner());
    const result = await voiceDictationHttp.postVoiceDownload({
      fileType: type,
      requestId: voiceDictationResult?.data.requestId as string,
      file: convertJsonToTxt()
    });

    const { data } = result;
    console.log('fileName', fileName);
    console.log('변환 완료', changeFileExtension(fileName, type));

    await Bridge.callBridgeApi('downloadVoiceFile', {
      fileName: changeFileExtension(fileName, type),
      url: data.downloadUrl
    });
  };

  const handleOpenSaveFileFormat = () => {
    overlay.closeAll();

    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <VoiceFileModalContent onSave={handleDownloadScriptFile} />
        </OverlayModal>
      );
    });
  };
  return (
    <ModalSheet isOpen={isOpened} setIsOpen={setIsOpened} detent="content-height">
      <S.Container>
        <S.Title>{t('Nova.voiceDictation.Button.Save')}</S.Title>
        <S.ItemWrapper>
          <S.Item onClick={handleDownloadVoiceFile}>
            <S.StyledMic />
            <p>{t('Nova.voiceDictation.Button.VoiceFile')}</p>
          </S.Item>

          <S.Item onClick={handleOpenSaveFileFormat}>
            <S.StyledFileImg />
            <p>{t('Nova.voiceDictation.Button.DictationFile')}</p>
          </S.Item>
        </S.ItemWrapper>
      </S.Container>
    </ModalSheet>
  );
}
