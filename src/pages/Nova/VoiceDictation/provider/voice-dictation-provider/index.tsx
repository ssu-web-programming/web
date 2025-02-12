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
  };
}

export type LangOptionValues = 'KO' | 'EN' | 'JA' | 'ZH-HANS' | 'ZH-HANT' | 'KO_EN';

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
      selectedLangOption: 'KO'
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
      selectedLangOption: 'KO'
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
