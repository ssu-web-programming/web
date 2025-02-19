import OverlayModal from 'components/overlay-modal';
import { overlay } from 'overlay-kit';
import { setIsMicrophoneState } from 'store/slices/appState';
import { themeInfoSelector } from 'store/slices/theme';
import { setLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';
import Bridge, { ClientType, getPlatform } from 'util/bridge';
import { blobToFile, convertWebmToWavFile } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioRecorder from '../audio-recorder';
import DesktopLangSelector from '../modals/desktop-lang-selector';
import StopModalContent from '../modals/stop-modal-content';

export default function VoiceAudioRecorder() {
  const {
    setSharedVoiceDictationInfo,
    sharedVoiceDictationInfo: { isVoiceRecording, previousPageType, selectedLangOption }
  } = useVoiceDictationContext();
  const { isLightMode } = useAppSelector(themeInfoSelector);

  const dispatch = useAppDispatch();

  const handleMoveToReady = async (file: File) => {
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

  const openLangOverlay = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <DesktopLangSelector />
        </OverlayModal>
      );
    });
  };

  return (
    <AudioRecorder
      onRecordingComplete={async (blob) => {
        console.log('완료된 blob', blob);
        console.log('파일객체로 변환된 blob', await convertWebmToWavFile(blob));
        handleMoveToReady(
          getPlatform() === ClientType.windows ? await convertWebmToWavFile(blob) : blobToFile(blob)
        );
      }}
      isInitRecording={isVoiceRecording}
      startCondition={isVoiceRecording && previousPageType === 'AUDIO_RECORDER'}
      onRecordingFinish={async () => {
        dispatch(setIsMicrophoneState(null));
        await Bridge.callBridgeApi('getRecordingState', false);
        // sessionStorage.setItem('hasStartedRecording', 'false');
      }}
      onStopConfirm={openStopOverlay}
      selectedLangOption={selectedLangOption}
      openLangOverlay={openLangOverlay}
      isLightMode={isLightMode}
    />
  );
}
