import translationHttp, {
  CheckTranslateStatusResponse,
  PostTranslateDocument,
  TranslateDocumentResponse
} from 'api/translation';
import { useConfirm } from 'components/Confirm';
import useErrorHandle from 'components/hooks/useErrorHandle';
import { usePolling } from 'hooks/use-polling';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { setError } from 'store/slices/errorSlice';
import { getCurrentFile, getDriveFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';

import { track } from '@amplitude/analytics-browser';

import {
  selectPageService,
  setPageServiceUsage
} from '../../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../../store/slices/tabSlice';
import { calLeftCredit } from '../../../../../util/common';
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
  // 전역상태의 번역 Context!
  const {
    setSharedTranslationInfo,
    triggerLoading,
    sharedTranslationInfo: { sourceLang, targetLang, isSwitchActive }
  } = useTranslationContext();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(getCurrentFile);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const confirm = useConfirm();
  const errorHandle = useErrorHandle();

  // 데이터 정제 작업을 위한 Hook
  const { convertFileObject, isDriveActive, sanitizedOriginFile } = useSanitizedDrive();
  const { start: translationRequest } = usePolling<
    TranslateDocumentResponse,
    CheckTranslateStatusResponse,
    PostTranslateDocument
  >({
    initialFn: async (params) => translationHttp.postTranslateDocument(params),
    pollingFn: (translateId) => translationHttp.postCheckTranslateStatus({ translateId }),
    getPollingId: ({ translateId }) => translateId,
    shouldContinue: ({ status }) => status === 'translating' || status === 'queued',
    onPollingSuccess: (result) => {
      const { deductionCredit } = calLeftCredit(result._headers);
      track('nova_translate', {
        file_id: currentFile.id,
        document_format: currentFile.ext,
        credit: deductionCredit,
        translate_type: 'file',
        function_result: true
      });

      const { downloadUrl } = result;
      handleMoveToFileResult({ downloadUrl });
    },
    onError: (error: any) => {
      if (error.code === 'Timeout') {
        handleErrorTrigger({
          title: t('Nova.TimeOut.Title'),
          onRetry: async () =>
            await translationRequest({ file: await convertFileObject(), sourceLang, targetLang })
        });

        return;
      } else if (error.code === 'damage') {
        confirm({
          msg: t('Nova.Alert.UnopenableDocError')!,
          onOk: {
            text: t('Confirm'),
            callback: () => {}
          }
        });
      } else {
        errorHandle(error);
      }

      setSharedTranslationInfo((prev) => ({
        ...prev,
        componentType: 'INTRO'
      }));

      track('nova_translate', {
        file_id: currentFile.id,
        document_format: currentFile.ext,
        translate_type: 'file',
        function_result: false
      });
    }
  });

  const handleMoveToTextResult = async ({
    detectedSourceLanguage,
    translatedText
  }: TranslateResult) => {
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
      handleMoveToTextResult({
        detectedSourceLanguage: detectedSourceLanguage.toUpperCase(),
        translatedText
      });

      dispatch(
        setPageServiceUsage({
          tab: selectedNovaTab,
          serviceType: service[0].serviceType,
          isUsed: true
        })
      );

      const { deductionCredit } = calLeftCredit(headers);
      track('nova_translate', {
        file_id: currentFile.id,
        document_format: currentFile.ext,
        credit: deductionCredit,
        translate_type: 'text'
      });
    } catch (e) {
      setSharedTranslationInfo((prev) => ({
        ...prev,
        componentType: 'INTRO'
      }));
      errorHandle(e);

      track('nova_translate', {
        file_id: currentFile.id,
        document_format: currentFile.ext,
        translate_type: 'text'
      });
    }
  };

  const submitFileTranslate = async () => {
    triggerLoading();
    // 손상된 여부 파악 로직!
    const { data } = await translationHttp.postCheckOpenStatus({
      fileId: driveFiles[0].fileId,
      fileRevision: driveFiles[0].fileRevision
    });

    if (data.status === 'UNOPENABLE_DOCUMENT' || data.status === 'PASSWORD') {
      setSharedTranslationInfo((prev) => ({
        ...prev,
        componentType: 'INTRO'
      }));

      await confirm({
        msg:
          data.status === 'UNOPENABLE_DOCUMENT'
            ? t('Nova.translation.Alert.DamagedDocument')!
            : t('Nova.translation.Alert.EncryptedDocument')!,
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });
      return;
    }

    const file = await convertFileObject();
    await translationRequest({ file, sourceLang, targetLang });

    dispatch(
      setPageServiceUsage({
        tab: selectedNovaTab,
        serviceType: service[0].serviceType,
        isUsed: true
      })
    );
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
