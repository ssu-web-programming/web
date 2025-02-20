import { useConfirm } from 'components/Confirm';
import { Guide } from 'components/nova/Guide';
import GuideBox from 'components/nova/guide-box';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { MEDIA_ERROR_MESSAGES } from 'constants/voice-dictation';
import { ReactComponent as MicDarkIcon } from 'img/dark/nova/voice-dictation/microphone.svg';
import { ReactComponent as MicLightIcon } from 'img/light/nova/voiceDictation/microphone.svg';
import { ReactComponent as Clova } from 'img/light/nova/voiceDictation/uses_clova_api.svg';
import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { useAppDispatch } from 'store/store';
import styled, { css } from 'styled-components';
import { MediaError, MediaErrorContent } from 'types/media-error';
import Bridge from 'util/bridge';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioFileUploader from '../audio-file-uploader';
import RecognizedLang from '../recognized-lang';

export default function VoiceDictationIntro() {
  const { t } = useTranslation();
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();

  const errorTrigger = (errorMesaage: MediaErrorContent) => {
    confirm({
      title: errorMesaage.title,
      msg: errorMesaage.msg,
      onOk: {
        text: t(`Confirm`)
      }
    });
  };

  const handleMoveToFileReady = () => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'FILE_READY'
    }));
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      await Bridge.callBridgeApi('getRecordingState', true);
      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        componentType: 'AUDIO_RECORDER',
        isVoiceRecording: true,
        previousPageType: 'AUDIO_RECORDER'
      }));
    } catch (error) {
      const mediaError = error as MediaError;
      const errorMesaage = MEDIA_ERROR_MESSAGES[mediaError.name];
      // 에러 타입에 맞는 팝업을 띄우면 된다.
      if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
        dispatch(
          activeToast({
            type: 'error',
            msg: errorMesaage.msg
          })
        );
      } else {
        errorTrigger(errorMesaage);
      }

      await Bridge.callBridgeApi('getRecordingState', false);
    }
  };

  return (
    <>
      <Guide
        $guideTitleStyle={css`
          margin-bottom: 16px;
        `}>
        <RecognizedLang />
        <S.BoxWrapper onClick={startRecording}>
          <GuideBox
            guideTitle={t(`Nova.voiceDictation.Button.LiveDictation`)}
            guideMsg={t('Nova.voiceDictation.Guide.TimeLimit')}
            lightIcon={<MicLightIcon />}
            darkIcon={<MicDarkIcon />}
          />
        </S.BoxWrapper>
        <AudioFileUploader
          guideMsg={t('Nova.voiceDictation.Guide.UploadGuide')}
          curTab={NOVA_TAB_TYPE.voiceDictation}
          handleUploadComplete={() => console.log('123')}
          creditCount={30}
          onNext={handleMoveToFileReady}
        />
      </Guide>

      <S.StyledClova />
    </>
  );
}

const S = {
  BoxWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 78px;
    padding: 16px;
    border-radius: 8px;
    background: ${({ theme }) => theme.color.background.gray01};
    border: 1px solid ${({ theme }) => theme.color.border.gray01};
  `,
  StyledClova: styled(Clova)`
    position: absolute;
    bottom: 34px;
    right: 16px;
    & path {
      fill: ${({ theme }) => theme.color.text.gray04};
    }
  `
};
