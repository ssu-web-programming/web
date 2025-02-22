import { ReactNode } from 'react';
import Loading from 'components/nova/Loading';
import BgContainer from 'pages/Nova/Translation/components/bg-container';

import {
  useVoiceDictationContext,
  VoiceDictationComponentType
} from '../../provider/voice-dictation-provider';
import VoiceAudioRecorder from '../voice-audio-recorder';
import VoiceDictationIntro from '../voice-dictation-intro';
import VoiceDictationReady from '../voice-dictation-ready';
import VoiceDictationResult from '../voice-dictation-result';

export default function VoiceDictationContent() {
  const {
    sharedVoiceDictationInfo: { componentType }
  } = useVoiceDictationContext();

  const componentMap: Record<VoiceDictationComponentType, ReactNode> = {
    LOADING: <Loading />,
    INTRO: <VoiceDictationIntro />,
    AUDIO_RECORDER: <VoiceAudioRecorder />,
    FILE_READY: <VoiceDictationReady />,
    VOICE_READY: <VoiceDictationReady />,
    RESULT: <VoiceDictationResult />
  };

  return <BgContainer>{componentMap[componentType]}</BgContainer>;
}
