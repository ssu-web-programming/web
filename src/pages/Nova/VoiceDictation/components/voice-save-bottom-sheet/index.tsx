import voiceDictationHttp from 'api/voice-dictation';
import ModalSheet from 'components/modalSheet';
import OverlayModal from 'components/overlay-modal';
import { ReactComponent as FileImg } from 'img/light/nova/voiceDictation/file.svg';
import { ReactComponent as Mic } from 'img/light/nova/voiceDictation/mic.svg';
import { overlay } from 'overlay-kit';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';
import { changeFileExtension } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import VoiceFileModalContent from '../voice-file-modal-content';

import * as S from './style';

interface Props {
  isOpened: boolean;
  setIsOpened: (isOpen: boolean) => void;
}

export default function VoiceSaveBottomSheet({ isOpened, setIsOpened }: Props) {
  const dispatch = useAppDispatch();
  const {
    sharedVoiceDictationInfo: { voiceDictationResult, fileName }
  } = useVoiceDictationContext();

  console.log('voiceDictationResult', voiceDictationResult);
  // 호진FIXME: 임의의 음성 파일 다운로드 URL 삽입
  const handleDownloadVoiceFile = async () => {
    dispatch(activeLoadingSpinner());
    await Bridge.callBridgeApi('downloadVoiceFile', {
      fileName,
      url: voiceDictationResult?.data.voiceUrl
    });
  };
  const parseJsonToText = () => {
    return voiceDictationResult?.data.segments.map((segment) => segment.text).join('');
  };

  const convertJsonToTxt = () => {
    const text = parseJsonToText() as string;

    const file = new File([text], fileName, {
      type: 'text/plain;charset=utf-8'
    });

    return file;
  };

  const handleDownloadScriptFile = async (type: 'txt' | 'pdf') => {
    console.log('handleDownloadScriptFile');
    dispatch(activeLoadingSpinner());
    const result = await voiceDictationHttp.postVoiceDownload({
      fileType: type,
      requestId: voiceDictationResult?.data.requestId as string,
      file: convertJsonToTxt()
    });

    const { data } = result;

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
        <S.Title>저장하기</S.Title>
        <S.ItemWrapper>
          <S.Item onClick={handleDownloadVoiceFile}>
            <Mic />
            <p>음성파일</p>
          </S.Item>

          <S.Item onClick={handleOpenSaveFileFormat}>
            <FileImg />
            <p>받아쓰기 파일</p>
          </S.Item>
        </S.ItemWrapper>
      </S.Container>
    </ModalSheet>
  );
}
