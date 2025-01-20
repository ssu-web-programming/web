import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export type ComponentType = 'INTRO' | 'TEXT_RESULT' | 'FILE_RESULT' | 'LANG_SEARCH';

interface SharedTranslation {
  componentType: ComponentType;
}

interface TranslationContextType {
  sharedTranslationInfo: SharedTranslation;
  setSharedTranslationInfo: Dispatch<SetStateAction<SharedTranslation>>;
}

interface Props {
  children: ReactNode;
}

export const TranslationContext = createContext<null | TranslationContextType>(null);

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('Translation must be used within a TranslationProvider');

  return context;
};

export function TranslationProvider({ children }: Props) {
  const [sharedTranslationInfo, setSharedTranslationInfo] = useState<SharedTranslation>({
    componentType: 'INTRO'
  });

  return (
    <TranslationContext.Provider value={{ sharedTranslationInfo, setSharedTranslationInfo }}>
      {children}
    </TranslationContext.Provider>
  );
}
