import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export type VoiceDictationComponentType =
  | 'INTRO'
  | 'LOADING'
  | 'AUDIO_RECORDER'
  | 'VOICE_READY'
  | 'FILE_READY'
  | 'RESULT';

interface Segments {
  confidence: number;
  diarization: {
    label: string;
  };
  end: number;
  speaker: {
    edited: boolean;
    label: string;
    name: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  };
  start: number;
  text: string;
  words: [number, number, string][];
}

export interface VoiceDictationResult {
  success: boolean;
  data: {
    segments: Segments[];
    requestId: string;
    voiceUrl: string;
  };
}

export type LangOptionValues = 'ko-KR' | 'en-US' | 'enko' | 'ja' | 'zh-cn' | 'zh-tw';

interface Props {
  children: ReactNode;
}

interface SharedVoiceDictationInfo {
  componentType: VoiceDictationComponentType;
  voiceDictationResult: VoiceDictationResult | null;
  audioDuration: string;
  isVoiceRecording: boolean;
  previousPageType: 'OPEN_TAB' | 'AUDIO_RECORDER' | null;
  selectedLangOption: LangOptionValues;
  fileName: string;
  currentTime: string;
}

interface VoiceDictationContextType {
  sharedVoiceDictationInfo: SharedVoiceDictationInfo;
  setSharedVoiceDictationInfo: Dispatch<SetStateAction<SharedVoiceDictationInfo>>;
  triggerLoading: () => void;
  resetVoiceInfo: () => void;
}

export const VoiceDictationContext = createContext<VoiceDictationContextType | null>(null);

export const useVoiceDictationContext = () => {
  const context = useContext(VoiceDictationContext);

  if (!context) throw new Error('VoiceDictation must be used within a TranslationProvider');

  return context;
};

export default function VoiceDictationProvider({ children }: Props) {
  const [sharedVoiceDictationInfo, setSharedVoiceDictationInfo] =
    useState<SharedVoiceDictationInfo>({
      componentType: 'INTRO',
      voiceDictationResult: null,
      audioDuration: '',
      isVoiceRecording: false,
      previousPageType: null,
      selectedLangOption: 'ko-KR',
      fileName: '',
      currentTime: ''
    });

  const triggerLoading = () => {
    setSharedVoiceDictationInfo({
      ...sharedVoiceDictationInfo,
      componentType: 'LOADING'
    });
  };

  const resetVoiceInfo = () => {
    setSharedVoiceDictationInfo({
      componentType: 'INTRO',
      voiceDictationResult: null,
      audioDuration: '',
      isVoiceRecording: false,
      previousPageType: null,
      selectedLangOption: 'ko-KR',
      fileName: '',
      currentTime: ''
    });
  };

  return (
    <VoiceDictationContext.Provider
      value={{
        sharedVoiceDictationInfo,
        setSharedVoiceDictationInfo,
        triggerLoading,
        resetVoiceInfo
      }}>
      {children}
    </VoiceDictationContext.Provider>
  );
}
