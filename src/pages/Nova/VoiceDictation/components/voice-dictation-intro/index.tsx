import { useConfirm } from 'components/Confirm';
import { Guide } from 'components/nova/Guide';
import GuideBox from 'components/nova/guide-box';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { MEDIA_ERROR_MESSAGES } from 'constants/voice-dictation';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { MediaError, MediaErrorContent } from 'types/media-error';
import Bridge from 'util/bridge';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioFileUploader from '../audio-file-uploader';
import RecognizedLang from '../recognized-lang';

export default function VoiceDictationIntro() {
  const { t } = useTranslation();
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
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
      console.log(mediaError);
      errorTrigger(errorMesaage);

      await Bridge.callBridgeApi('getRecordingState', false);
    }
  };
  return (
    <Guide
      $guideTitleStyle={css`
        margin-bottom: 16px;
      `}>
      <RecognizedLang />
      <S.BoxWrapper onClick={startRecording}>
        <GuideBox guideTitle="실시간 받아쓰기" guideMsg={'최대 30분 가능합니다.'} />
      </S.BoxWrapper>
      <AudioFileUploader
        guideMsg={t('Nova.voiceDictation.Guide.UploadGuide')}
        curTab={NOVA_TAB_TYPE.voiceDictation}
        handleUploadComplete={() => console.log('123')}
        creditCount={30}
        onNext={handleMoveToFileReady}
      />
    </Guide>
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
    background-color: var(--white);
    border: 1px dashed var(--gray-gray-40);
  `
};
