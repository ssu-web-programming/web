import { Guide } from 'components/nova/Guide';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { useTranslation } from 'react-i18next';
import { setIsClosedNovaState } from 'store/slices/appState';
import { useAppDispatch } from 'store/store';
import Bridge, { ClientType, getPlatform } from 'util/bridge';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioFileUploader from '../audio-file-uploader';
import RecognizedLang from '../recognized-lang';

export default function VoiceDictationIntro() {
  const { t } = useTranslation();
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
  const dispatch = useAppDispatch();

  const handleMoveToFileReady = () => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'FILE_READY'
    }));
  };

  const startRecording = async () => {
    try {
      if (getPlatform() === ClientType.android) {
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
      <RecognizedLang />
      <AudioFileUploader
        guideMsg={t('Nova.voiceDictation.Guide.UploadGuide')}
        curTab={NOVA_TAB_TYPE.voiceDictation}
        handleUploadComplete={() => console.log('123')}
        creditCount={30}
        onNext={handleMoveToFileReady}
      />
      <button onClick={() => dispatch(setIsClosedNovaState(true))}>팝업 뜨는지 확인</button>
    </Guide>
  );
}
