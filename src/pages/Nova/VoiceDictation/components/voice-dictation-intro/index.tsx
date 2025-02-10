import { Guide } from 'components/nova/Guide';
import GuideBox from 'components/nova/guide-box';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Bridge, { ClientType, getPlatform } from 'util/bridge';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioFileUploader from '../audio-file-uploader';

export default function VoiceDictationIntro() {
  const { t } = useTranslation();
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();

  const handleMoveToFileReady = () => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'FILE_READY'
    }));
  };

  const startRecording = async () => {
    try {
      if (getPlatform() === ClientType.android) {
        console.log('AOS 핸들러 호출 로직!');
        await Bridge.callBridgeApi('getAudioPermission', true);
      }
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await Bridge.callBridgeApi('getRecordingState', true);
      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        componentType: 'AUDIO_RECORDER'
      }));
    } catch (e) {
      console.log('123123', e);
      await Bridge.callBridgeApi('getRecordingState', false);
    }
  };

  return (
    <Guide onClick={startRecording}>
      {/* <RecognizedLang /> */}
      {/* <VoiceRealtimeDictation /> */}
      <S.BoxWrapper>
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
