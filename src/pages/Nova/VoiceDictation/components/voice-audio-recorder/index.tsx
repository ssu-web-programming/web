import OverlayModal from 'components/overlay-modal';
import { overlay } from 'overlay-kit';
import { setIsMicrophoneState } from 'store/slices/appState';
import { platformInfoSelector } from 'store/slices/platformInfo';
import { useAppDispatch, useAppSelector } from 'store/store';
import Bridge, { ClientType } from 'util/bridge';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import DesktopLangSelector from '../modals/desktop-lang-selector';
import MobileLangSelector from '../modals/mobile-lang-selector';
import StopModalContent from '../modals/stop-modal-content';
import TestAudioRecorder from '../test-audio-recorder';

export default function VoiceAudioRecorder() {
  const {
    sharedVoiceDictationInfo: { isVoiceRecording, selectedLangOption }
  } = useVoiceDictationContext();

  const dispatch = useAppDispatch();
  const { platform } = useAppSelector(platformInfoSelector);

  const isMobile = platform === ClientType.ios || platform === ClientType.android;

  const openStopOverlay = async () => {
    return await overlay.openAsync(({ isOpen, close }) => (
      <OverlayModal isOpen={isOpen} onClose={() => close(false)}>
        <StopModalContent onConfirm={() => close(true)} />
      </OverlayModal>
    ));
  };

  const openLangOverlay = () => {
    overlay.open(({ isOpen, close }) => (
      <OverlayModal isOpen={isOpen} onClose={close}>
        <DesktopLangSelector />
      </OverlayModal>
    ));
  };

  const openMobileLangOverlay = () => {
    overlay.open(({ isOpen, close }) => (
      <OverlayModal isOpen={isOpen} onClose={close}>
        <MobileLangSelector isOpened={isOpen} setIsOpened={close} />
      </OverlayModal>
    ));
  };

  const handleRecordingFinish = async () => {
    dispatch(setIsMicrophoneState(null));
    await Bridge.callBridgeApi('getRecordingState', false);
  };

  return (
    <>
      <TestAudioRecorder
        isInitRecording={isVoiceRecording}
        onRecordingFinish={handleRecordingFinish}
        onStopConfirm={openStopOverlay as any}
        selectedLangOption={selectedLangOption}
        openLangOverlay={isMobile ? openMobileLangOverlay : openLangOverlay}
      />
    </>
  );
}
