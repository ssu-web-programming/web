import translationHttp, {
  CheckTranslateStatusResponse,
  PostTranslateDocument,
  TranslateDocumentResponse
} from 'api/translation';
import { useShowCreditToast } from 'components/hooks/useShowCreditToast';
import { usePolling } from 'hooks/use-polling';
import { overlay } from 'overlay-kit';
import { setError } from 'store/slices/errorSlice';
import { useAppDispatch } from 'store/store';
import { calLeftCredit } from 'util/common';

import LanguageSearch from '../../components/language-search';
import {
  LangType,
  TranslateResult,
  useTranslationContext
} from '../../provider/translation-provider';
import useSanitizedDrive from '../use-sanitized-drive';

export const LANGUAGE_VARIANTS = {
  EN: ['EN-US', 'EN-GB'],
  ZH: ['ZH-HANS', 'ZH-HANT'],
  PT: ['PT-BR', 'PT-PT']
} as const;

// 타입 정의
export type EnglishVariant = (typeof LANGUAGE_VARIANTS.EN)[number];
export type ChineseVariant = (typeof LANGUAGE_VARIANTS.ZH)[number];
export type PortugueseVariant = (typeof LANGUAGE_VARIANTS.PT)[number];

export const isLanguageVariant = (lang: string): boolean => {
  return [...LANGUAGE_VARIANTS.EN, ...LANGUAGE_VARIANTS.ZH, ...LANGUAGE_VARIANTS.PT].includes(
    lang as any
  );
};

export const getBaseLanguage = (variant: string): string | null => {
  if (LANGUAGE_VARIANTS.EN.includes(variant as EnglishVariant)) return 'EN';
  if (LANGUAGE_VARIANTS.ZH.includes(variant as ChineseVariant)) return 'ZH';
  if (LANGUAGE_VARIANTS.PT.includes(variant as PortugueseVariant)) return 'PT';
  return null;
};

export type LanguageVariant = EnglishVariant | ChineseVariant | PortugueseVariant;

const useTranslationIntro = (translateInputValue: string) => {
  const showCreditToast = useShowCreditToast();
  // 전역상태의 번역 Context!
  const {
    setSharedTranslationInfo,
    triggerLoading,
    sharedTranslationInfo: { sourceLang, targetLang, isSwitchActive }
  } = useTranslationContext();
  const dispatch = useAppDispatch();

  // 데이터 정제 작업을 위한 Hook
  const { convertFileObject, isDriveActive, sanitizedOriginFile } = useSanitizedDrive();
  const { start: translationRequest } = usePolling<
    TranslateDocumentResponse,
    CheckTranslateStatusResponse,
    PostTranslateDocument
  >({
    initialFn: (params) => translationHttp.postTranslateDocument(params),
    pollingFn: (translateId) => translationHttp.postCheckTranslateStatus({ translateId }),
    getPollingId: ({ translateId }) => translateId,
    shouldContinue: ({ status }) => status === 'translating' || status === 'queued',
    onPollingSuccess: (result) => {
      const { downloadUrl } = result;
      handleMoveToFileResult({ downloadUrl });
    },
    onError: (error) => {
      console.log('error', error);
      handleErrorTrigger({ title: '오류가 발생했습니다. 잠시 후 다시 시작해주세요.' });
    }
  });

  const handleMoveToTextResult = ({ detectedSourceLanguage, translatedText }: TranslateResult) => {
    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'TEXT_RESULT',
      detectedSourceLanguage,
      translatedText,
      translateInputValue
    }));
  };

  const handleMoveToFileResult = async ({ downloadUrl }: { downloadUrl: string }) => {
    const sanitizedFile = (await sanitizedOriginFile()) as any;

    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'FILE_RESULT',
      ...sanitizedFile,
      translationFileUrl: downloadUrl,
      translationFileName: sanitizedFile.originalFileName
    }));
  };

  const submitTextTranslate = async () => {
    triggerLoading();
    try {
      const { response, headers } = await translationHttp.postTranslateText({
        text: translateInputValue,
        sourceLang,
        targetLang
      });

      const {
        result: { detectedSourceLanguage, translatedText }
      } = response;

      const { deductionCredit, leftCredit } = calLeftCredit(headers);
      showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'nova');

      handleMoveToTextResult({
        detectedSourceLanguage: detectedSourceLanguage.toUpperCase(),
        translatedText
      });
    } catch (e) {
      console.log('e', e);
    }
  };

  const submitFileTranslate = async () => {
    triggerLoading();

    try {
      await translationRequest({ file: await convertFileObject(), sourceLang, targetLang });
    } catch (e) {
      handleErrorTrigger({ title: '오류가 발생했습니다. 잠시 후 다시 시작해주세요.' });
    }
  };

  // const convertTargetLang = (targetLang: string) => {
  //   if (targetLang === 'EN-US' || targetLang === 'EN-GB') {
  //     return 'EN';
  //   }

  //   return targetLang;
  // };

  // const convertSourceLang = (sourceLang: string) => {
  //   return sourceLang;
  // };

  const getNewSourceLang = (targetLang: string): string => {
    const baseLang = getBaseLanguage(targetLang);
    return baseLang || targetLang;
  };

  const getNewTargetLang = (sourceLang: string, previousVariant: string | undefined): string => {
    switch (sourceLang) {
      case 'EN':
        return previousVariant || 'EN-US';
      case 'ZH':
        return previousVariant || 'ZH-HANS';
      case 'PT':
        return previousVariant || 'PT-BR';
      default:
        return sourceLang;
    }
  };
  const getPreviousVariant = (
    currentTargetLang: string,
    currentPreviousVariant: string | undefined
  ): string | undefined => {
    return isLanguageVariant(currentTargetLang) ? currentTargetLang : currentPreviousVariant;
  };

  const handleSwitchLang = () => {
    console.log('isSwitchActive', isSwitchActive);
    if (isSwitchActive) {
      setSharedTranslationInfo((prev) => ({
        ...prev,
        sourceLang: getNewSourceLang(prev.targetLang),
        targetLang: getNewTargetLang(prev.sourceLang, prev.previousEnglishVariant),
        previousEnglishVariant: getPreviousVariant(prev.targetLang, prev.previousEnglishVariant)
      }));
    }
  };

  const handleOpenLangSearch = (type: LangType) => {
    overlay.open(({ isOpen, close }) => (
      <LanguageSearch
        isOpen={isOpen}
        close={close}
        langType={type}
        setSharedTranslationInfo={setSharedTranslationInfo}
      />
    ));
  };

  const handleErrorTrigger = ({ title, onRetry }: { title: string; onRetry?: () => void }) => {
    dispatch(
      setError({
        title,
        onRetry // 재시도 시 실행할 함수 전달
      })
    );
  };

  return {
    isTranslateActive: isDriveActive,
    submitTextTranslate,
    submitFileTranslate,
    handleSwitchLang,
    handleOpenLangSearch
  };
};

export default useTranslationIntro;
