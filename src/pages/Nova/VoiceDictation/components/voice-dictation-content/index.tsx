import { ReactNode } from 'react';
import Loading from 'components/nova/Loading';
import BgContainer from 'pages/Nova/Translation/components/bg-container';

import {
  useVoiceDictationContext,
  VoiceDictationComponentType
} from '../../provider/voice-dictation-provider';
import VoiceDictationIntro from '../voice-dictation-intro';
import VoiceDictationResult from '../voice-dictation-result';

export default function VoiceDictationContent() {
  const {
    sharedVoiceDictationInfo: { componentType }
  } = useVoiceDictationContext();

  const componentMap: Record<VoiceDictationComponentType, ReactNode> = {
    LOADING: <Loading />,
    INTRO: <VoiceDictationIntro />,
    RESULT: <VoiceDictationResult />
  };

  return <BgContainer>{componentMap[componentType]}</BgContainer>;
}
