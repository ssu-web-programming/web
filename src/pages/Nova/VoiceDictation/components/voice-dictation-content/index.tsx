import { ReactNode, useEffect } from 'react';
import Loading from 'components/nova/Loading';
import OverlayModal from 'components/overlay-modal';
import { overlay } from 'overlay-kit';
import BgContainer from 'pages/Nova/Translation/components/bg-container';
import { appStateSelector } from 'store/slices/appState';
import { useAppSelector } from 'store/store';
import Bridge from 'util/bridge';

import {
  useVoiceDictationContext,
  VoiceDictationComponentType
} from '../../provider/voice-dictation-provider';
import ClosedModalContent from '../modals/closed-modal-content';
import VoiceAudioRecorder from '../voice-audio-recorder';
import VoiceDictationIntro from '../voice-dictation-intro';
import VoiceDictationReady from '../voice-dictation-ready';
import VoiceDictationResult from '../voice-dictation-result';

export default function VoiceDictationContent() {
  const {
    sharedVoiceDictationInfo: { componentType },
    resetVoiceInfo
  } = useVoiceDictationContext();
  const { isClosedNova } = useAppSelector(appStateSelector);

  const componentMap: Record<VoiceDictationComponentType, ReactNode> = {
    LOADING: <Loading />,
    INTRO: <VoiceDictationIntro />,
    AUDIO_RECORDER: <VoiceAudioRecorder />,
    FILE_READY: <VoiceDictationReady />,
    VOICE_READY: <VoiceDictationReady />,
    RESULT: <VoiceDictationResult />
  };

  const handleResetVoiceInfo = async () => {
    await Bridge.callBridgeApi('closeNova');
    resetVoiceInfo();
  };

  const openClosedModal = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <ClosedModalContent
            title={
              '잠깐! 녹음을 끝내지 않고 종료하면 녹음이 저장되지 않아요. 그래도 종료하시겠어요?'
            }
            onConfirm={handleResetVoiceInfo}
          />
        </OverlayModal>
      );
    });
  };

  useEffect(() => {
    // client에서 nova 닫는 요청이 들어올때 해당 closed 버튼을 통해 팝업을 띄우고 닫는다.
    if (isClosedNova) {
      openClosedModal();
    }
  }, [isClosedNova]);

  return <BgContainer>{componentMap[componentType]}</BgContainer>;
}
