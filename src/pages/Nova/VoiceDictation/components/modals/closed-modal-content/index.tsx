import { overlay } from 'overlay-kit';
import { useAudioRecorder } from 'pages/Nova/VoiceDictation/provider/audio-recorder-provider';
import { setIsClosedNovaState } from 'store/slices/appState';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';

import * as S from './style';

interface Props {
  onConfirm?: () => void;
  title: string;
  closeTxt?: string;
  confirmTxt?: string;
}

export default function ClosedModalContent({
  onConfirm,
  title,
  closeTxt = '취소',
  confirmTxt = '종료하기'
}: Props) {
  const dispatch = useAppDispatch();
  const { initializingRecording } = useAudioRecorder();

  const handleCancle = () => {
    overlay.closeAll();
    dispatch(setIsClosedNovaState(false));
  };

  const handleClose = async () => {
    overlay.closeAll();
    await Bridge.callBridgeApi('getRecordingState', false);
    initializingRecording();
    dispatch(setIsClosedNovaState(false));
    onConfirm && onConfirm();
  };

  return (
    <>
      <S.ModalContainer>
        <S.SubTitle>{title}</S.SubTitle>
        <S.ButtonGroup>
          <S.Button onClick={handleCancle}>{closeTxt}</S.Button>
          <S.Button primary onClick={handleClose}>
            {confirmTxt}
          </S.Button>
        </S.ButtonGroup>
      </S.ModalContainer>
    </>
  );
}
