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
import { TranslateType } from '../../components/translation-intro';
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

const useTranslationIntro = (translateInputValue: string, type: TranslateType) => {
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

  const getNewSourceLang = (targetLang: string): string => {
    // 예: EN-US -> EN, ZH-HANS -> ZH, PT-BR -> PT
    return getBaseLanguage(targetLang) || targetLang;
  };

  const getNewTargetLang = (
    sourceLang: string,
    previousVariant: Record<string, string>
  ): string => {
    // 현재 source 언어에 해당하는 이전 변형이 있으면 사용
    if (previousVariant[sourceLang]) {
      return previousVariant[sourceLang];
    }

    // 없으면 기본값 반환
    switch (sourceLang) {
      case 'EN':
        return 'EN-US';
      case 'ZH':
        return 'ZH-HANS';
      case 'PT':
        return 'PT-BR';
      default:
        return sourceLang;
    }
  };

  const getPreviousVariant = (
    currentTargetLang: string,
    currentPreviousVariant: Record<string, string> = {}
  ): Record<string, string> => {
    const baseLang = getBaseLanguage(currentTargetLang);
    if (baseLang && isLanguageVariant(currentTargetLang)) {
      return {
        ...currentPreviousVariant,
        [baseLang]: currentTargetLang
      };
    }
    return currentPreviousVariant;
  };

  const handleSwitchLang = () => {
    if (isSwitchActive) {
      setSharedTranslationInfo((prev) => {
        const newSourceLang = getNewSourceLang(prev.targetLang);
        const newTargetLang = getNewTargetLang(prev.sourceLang, prev.previousVariant);

        return {
          ...prev,
          sourceLang: newSourceLang,
          targetLang: newTargetLang,
          previousVariant: getPreviousVariant(prev.targetLang, prev.previousVariant)
        };
      });
    }
  };

  const handleOpenLangSearch = (langType: LangType) => {
    overlay.open(({ isOpen, close }) => (
      <LanguageSearch
        isOpen={isOpen}
        close={close}
        langType={langType}
        setSharedTranslationInfo={setSharedTranslationInfo}
        btnType={type}
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
