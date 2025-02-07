import ModalSheet from 'components/modalSheet';
import OverlayModal from 'components/overlay-modal';
import { ReactComponent as File } from 'img/light/nova/voiceDictation/file.svg';
import { ReactComponent as Mic } from 'img/light/nova/voiceDictation/mic.svg';
import { overlay } from 'overlay-kit';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';

import VoiceFileModalContent from '../voice-file-modal-content';

import * as S from './style';

interface Props {
  isOpened: boolean;
  setIsOpened: (isOpen: boolean) => void;
}

export default function VoiceSaveBottomSheet({ isOpened, setIsOpened }: Props) {
  const dispatch = useAppDispatch();

  // 호진FIXME: 임의의 음성 파일 다운로드 URL 삽입
  const handleDownloadVoiceFile = async () => {
    dispatch(activeLoadingSpinner());
    await Bridge.callBridgeApi('downloadVoiceFile', {
      fileName: '임의의 파일',
      url: 'https://vf-berlin.polarisoffice.com/nova/storage/speech/5723850b-c668-47aa-a87b-d245f980c9b1/voice_1738829359.mp3'
    });
  };

  const handleOpenSaveFileFormat = () => {
    overlay.closeAll();

    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <VoiceFileModalContent />
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
            <File />
            <p>받아쓰기 파일</p>
          </S.Item>
        </S.ItemWrapper>
      </S.Container>
    </ModalSheet>
  );
}
