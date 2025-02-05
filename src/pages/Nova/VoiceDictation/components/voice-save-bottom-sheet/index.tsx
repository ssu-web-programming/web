import ModalSheet from 'components/modalSheet';
import OverlayModal from 'components/overlay-modal';
import { ReactComponent as File } from 'img/light/nova/voiceDictation/file.svg';
import { ReactComponent as Mic } from 'img/light/nova/voiceDictation/mic.svg';
import { overlay } from 'overlay-kit';

import VoiceFileModalContent from '../voice-file-modal-content';

import * as S from './style';

interface Props {
  isOpened: boolean;
  setIsOpened: (isOpen: boolean) => void;
}

export default function VoiceSaveBottomSheet({ isOpened, setIsOpened }: Props) {
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
    <ModalSheet isOpen={isOpened} setIsOpen={setIsOpened}>
      <S.Container>
        <S.Title>저장하기</S.Title>
        <S.ItemWrapper>
          <S.Item>
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
