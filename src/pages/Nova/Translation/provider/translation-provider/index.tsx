import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { lang } from 'locale';

export type ComponentType = 'INTRO' | 'TEXT_RESULT' | 'FILE_RESULT' | 'LOADING';
export type LangType = 'source' | 'target';
export type OriginalFileType = 'currentDoc' | 'drive';

export interface TranslateResult {
  detectedSourceLanguage: string;
  translatedText: string;
}

export interface SharedTranslation extends TranslateResult {
  componentType: ComponentType;
  translateInputValue: string;

  // 원본-번역 비교보기를 위한 로직
  originalFileType: OriginalFileType;
  originalFileName: string;
  originFile: any;
  translationFileName: string;
  translationFileUrl: string;

  // 번역 코드 관리를 위한 로직
  sourceLang: string;
  targetLang: string;
  previousEnglishVariant?: string;
  previousVariant: any;
  LangType: LangType;
  isSwitchActive: boolean;
}

interface TranslationContextType {
  sharedTranslationInfo: SharedTranslation;
  setSharedTranslationInfo: Dispatch<SetStateAction<SharedTranslation>>;
  triggerLoading: () => void;
  resetTranslation: () => void;
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

// 호진FIXME: 아래 하나의 state로 관리되는 부분을 hook을 통해 관심사별로 분리하면 좋을 듯
export function TranslationProvider({ children }: Props) {
  const getSourceLang = () => {
    if (lang === 'ja') {
      return 'JA';
    }
    if (lang === 'ko') {
      return 'KO';
    }
    return 'EN';
  };

  const getTargetLang = () => {
    if (lang === 'ja') {
      return 'EN-US';
    }
    if (lang === 'ko') {
      return 'EN-US';
    }
    return 'ES';
  };

  // 초기 상태를 함수로 정의하여 재사용성 높이기
  const getInitialState = (): SharedTranslation => ({
    componentType: 'INTRO',
    translateInputValue: '',
    detectedSourceLanguage: '',
    translatedText: '',
    originalFileType: 'drive',
    originalFileName: '',
    originFile: '',
    translationFileName: '',
    translationFileUrl: '',
    sourceLang: getSourceLang(),
    targetLang: getTargetLang(),
    previousEnglishVariant: 'EN-US',
    previousVariant: {},
    LangType: 'source',
    isSwitchActive: true
  });

  const [sharedTranslationInfo, setSharedTranslationInfo] =
    useState<SharedTranslation>(getInitialState());

  // 번역 상태 초기화 함수
  const resetTranslation = () => {
    setSharedTranslationInfo(getInitialState());
  };

  const triggerLoading = () => {
    setSharedTranslationInfo({
      ...sharedTranslationInfo,
      componentType: 'LOADING'
    });
  };

  return (
    <TranslationContext.Provider
      value={{
        sharedTranslationInfo,
        setSharedTranslationInfo,
        triggerLoading,
        resetTranslation
      }}>
      {children}
    </TranslationContext.Provider>
  );
}
