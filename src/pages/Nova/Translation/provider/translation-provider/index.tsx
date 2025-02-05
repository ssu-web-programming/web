import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export type ComponentType = 'INTRO' | 'TEXT_RESULT' | 'FILE_RESULT' | 'LANG_SEARCH' | 'LOADING';

export interface TranslateResult {
  detectedSourceLanguage: string;
  translatedText: string;
}

interface SharedTranslation extends TranslateResult {
  componentType: ComponentType;
  translateInputValue: string;

  // 원본-번역 비교보기를 위한 로직
  originalFileType: 'currentDoc' | 'drive' | 'local';
  originalFileName: string;
  originFile: any;
  translationFileName: string;
  translationFileUrl: string;
}

interface TranslationContextType {
  sharedTranslationInfo: SharedTranslation;
  setSharedTranslationInfo: Dispatch<SetStateAction<SharedTranslation>>;
  triggerLoading: () => void;
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
    componentType: 'INTRO',
    // 번역 할 문장
    translateInputValue: '',
    // 감지된 언어
    detectedSourceLanguage: '',
    // 번역 된 문장
    translatedText: '',
    originalFileType: 'local',
    originalFileName: '이름',
    originFile: '',
    translationFileName: '',
    translationFileUrl: ''
  });

  const triggerLoading = () => {
    setSharedTranslationInfo({
      ...sharedTranslationInfo,
      componentType: 'LOADING'
    });
  };

  return (
    <TranslationContext.Provider
      value={{ sharedTranslationInfo, setSharedTranslationInfo, triggerLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}
