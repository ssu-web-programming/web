import { overlay } from 'overlay-kit';
import { useVoiceDictationContext } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';

import * as S from './style';

interface Props {
  onConfirm?: () => void;
}

export default function StopModalContent({ onConfirm }: Props) {
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();

  const handleCancle = () => {
    overlay.closeAll();
  };

  const handleClose = () => {
    overlay.closeAll();
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      isVoiceRecording: false
    }));
    onConfirm && onConfirm();
  };

  return (
    <>
      <S.ModalContainer>
        <S.Title>녹음을 종료할까요?</S.Title>
        <S.SubTitle>녹음이 종료되면 Nova가 음성을 텍스트로 변환합니다.</S.SubTitle>
        <S.ButtonGroup>
          <S.Button onClick={handleCancle}>취소</S.Button>
          <S.Button primary onClick={handleClose}>
            녹음 종료
          </S.Button>
        </S.ButtonGroup>
      </S.ModalContainer>
    </>
  );
}
