import { overlay } from 'overlay-kit';
import { useVoiceDictationContext } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { useTranslation } from 'react-i18next';

import * as S from './style';

interface Props {
  onConfirm?: () => void;
}

export default function StopModalContent({ onConfirm }: Props) {
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
  const { t } = useTranslation();

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
        <S.Title>{t('Nova.voiceDictation.Alert.StopRecordingConfirm')}</S.Title>
        <S.SubTitle>{t('Nova.voiceDictation.Alert.ConversionNotice')}</S.SubTitle>
        <S.ButtonGroup>
          <S.Button onClick={handleCancle}>{t('Nova.voiceDictation.Button.Cancel')}</S.Button>
          <S.Button primary onClick={handleClose}>
            {t('Nova.voiceDictation.Button.StopRecording')}
          </S.Button>
        </S.ButtonGroup>
      </S.ModalContainer>
    </>
  );
}
