import translationHttp, {
  CheckTranslateStatusResponse,
  PostTranslateDocument,
  TranslateDocumentResponse
} from 'api/translation';
import { useShowCreditToast } from 'components/hooks/useShowCreditToast';
import { usePolling } from 'hooks/use-polling';
import { overlay } from 'overlay-kit';
import { calLeftCredit } from 'util/common';

import LanguageSearch from '../../components/language-search';
import {
  LangType,
  TranslateResult,
  useTranslationContext
} from '../../provider/translation-provider';
import useSanitizedDrive from '../use-sanitized-drive';

const useTranslationIntro = (translateInputValue: string) => {
  const showCreditToast = useShowCreditToast();
  // 전역상태의 번역 Context!
  const {
    setSharedTranslationInfo,
    triggerLoading,
    sharedTranslationInfo: { sourceLang, targetLang, isSwitchActive }
  } = useTranslationContext();

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

    await translationRequest({ file: await convertFileObject(), sourceLang, targetLang });
  };

  const handleSwitchLang = () => {
    if (isSwitchActive) {
      setSharedTranslationInfo((prev) => ({
        ...prev,
        sourceLang: targetLang,
        targetLang: sourceLang
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

  return {
    isTranslateActive: isDriveActive,
    submitTextTranslate,
    submitFileTranslate,
    handleSwitchLang,
    handleOpenLangSearch
  };
};

export default useTranslationIntro;
