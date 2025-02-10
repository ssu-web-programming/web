import translationHttp from 'api/translation';
import { useShowCreditToast } from 'components/hooks/useShowCreditToast';
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
  const {
    setSharedTranslationInfo,
    triggerLoading,
    sharedTranslationInfo: { sourceLang, targetLang, isSwitchActive }
  } = useTranslationContext();
  const { convertFileObject, isDriveActive, sanitizedOriginFile } = useSanitizedDrive();

  const handleMoveToTextResult = ({ detectedSourceLanguage, translatedText }: TranslateResult) => {
    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'TEXT_RESULT',
      detectedSourceLanguage,
      translatedText,
      translateInputValue
    }));
  };

  const handleMoveToFileResult = () => {
    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'FILE_RESULT',
      ...sanitizedOriginFile()
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

    const response = await translationHttp.postTranslateDocument({
      file: await convertFileObject(),
      sourceLang,
      targetLang
    });

    // handleMoveToFileResult();
    console.log('submitFileTranslate-response', response);
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
