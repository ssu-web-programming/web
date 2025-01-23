import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type ComponentType = 'INTRO';

interface Props {
  children: ReactNode;
}

interface SharedVoiceDictationInfo {
  componentType: ComponentType;
}

interface VoiceDictationContextType {
  sharedVoiceDictationInfo: SharedVoiceDictationInfo;
  setSharedVoiceDictationInfo: Dispatch<SetStateAction<SharedVoiceDictationInfo>>;
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
      componentType: 'INTRO'
    });

  return (
    <VoiceDictationContext.Provider
      value={{ sharedVoiceDictationInfo, setSharedVoiceDictationInfo }}>
      {children}
    </VoiceDictationContext.Provider>
  );
}
