// VoiceAudioRecorder.tsx
import React from 'react';
import OverlayModal from 'components/overlay-modal';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { overlay } from 'overlay-kit';
import { setIsMicrophoneState } from 'store/slices/appState';
import { selectNovaTab } from 'store/slices/tabSlice';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import DesktopLangSelector from '../modals/desktop-lang-selector';
import StopModalContent from '../modals/stop-modal-content';
import TestAudioRecorder from '../test-audio-recorder';

export default function VoiceAudioRecorder() {
  const {
    sharedVoiceDictationInfo: { isVoiceRecording, selectedLangOption }
  } = useVoiceDictationContext();

  const dispatch = useAppDispatch();

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

  const handleRecordingFinish = async () => {
    dispatch(setIsMicrophoneState(null));
    await Bridge.callBridgeApi('getRecordingState', false);
  };

  return (
    <>
      <button
        onClick={() => {
          dispatch(selectNovaTab(NOVA_TAB_TYPE.removeBG));
        }}>
        이동해봐라!
      </button>
      {/* <TestAudioRecorder */}
      <TestAudioRecorder
        // onRecordingComplete={async (blob) => {
        //   handleMoveToReady(
        //     platform === ClientType.windows ? await convertWebmToWavFile(blob) : blobToFile(blob)
        //   );
        // }}
        isInitRecording={isVoiceRecording}
        onRecordingFinish={handleRecordingFinish}
        onStopConfirm={openStopOverlay as any}
        selectedLangOption={selectedLangOption}
        openLangOverlay={openLangOverlay}
      />
    </>
  );
}
