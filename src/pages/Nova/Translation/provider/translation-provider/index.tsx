import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export type ComponentType = 'INTRO' | 'TEXT_RESULT' | 'FILE_RESULT' | 'LOADING';
export type LangType = 'source' | 'target';
export type OriginalFileType = 'currentDoc' | 'drive' | 'local';

export interface TranslateResult {
  detectedSourceLanguage: string;
  translatedText: string;
}

interface SharedTranslation extends TranslateResult {
  componentType: ComponentType;
  translateInputValue: string;

  // 원본-번역 비교보기를 위한 로직
  originalFileType: OriginalFileType;
  originalFileName: string;
  originFile: any;
  translationFileName: string;
  translationFileUrl: string;
  sourceLang: string;
  targetLang: string;
  LangType: LangType;
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
  // 비슷한 조건별로 state를 쪼게면 좋을 듯
  const [sharedTranslationInfo, setSharedTranslationInfo] = useState<SharedTranslation>({
    componentType: 'INTRO',
    // 번역 할 문장
    translateInputValue: '',
    // 감지된 언어
    detectedSourceLanguage: '',
    // 번역 된 문장
    translatedText: '',
    // 원본-번역 비교보기를 위해 필요한 기능
    originalFileType: 'local',
    originalFileName: '',
    originFile: '',
    translationFileName: '',
    translationFileUrl: '',
    // 언어 BottomSheet
    sourceLang: 'KO',
    targetLang: 'EN-US',
    LangType: 'source'
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
