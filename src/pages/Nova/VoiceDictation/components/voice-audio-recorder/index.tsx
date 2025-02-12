import OverlayModal from 'components/overlay-modal';
import { overlay } from 'overlay-kit';
import { setIsMicrophoneState } from 'store/slices/appState';
import { setLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';
import { blobToFile } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioRecorder from '../audio-recorder';
import StopModalContent from '../modals/stop-modal-content';

export default function VoiceAudioRecorder() {
  const {
    setSharedVoiceDictationInfo,
    sharedVoiceDictationInfo: { isVoiceRecording, previousPageType }
  } = useVoiceDictationContext();
  const dispatch = useAppDispatch();

  const handleMoveToReady = async (file: File) => {
    console.log('file', file);
    dispatch(setLocalFiles([file]));

    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'VOICE_READY'
    }));
  };

  const openStopOverlay = async () => {
    return await overlay.openAsync(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={() => close(false)}>
          <StopModalContent onConfirm={() => close(true)} />
        </OverlayModal>
      );
    });
  };

  return (
    <AudioRecorder
      onRecordingComplete={async (blob) => {
        console.log('Recording completed:', blob);
        handleMoveToReady(blobToFile(blob));
      }}
      isInitRecording={isVoiceRecording}
      startCondition={isVoiceRecording && previousPageType === 'AUDIO_RECORDER'}
      onRecordingFinish={() => {
        dispatch(setIsMicrophoneState(null));
        Bridge.callBridgeApi('getRecordingState', false);
        // sessionStorage.setItem('hasStartedRecording', 'false');
      }}
      onStopConfirm={openStopOverlay}
    />
  );
}
