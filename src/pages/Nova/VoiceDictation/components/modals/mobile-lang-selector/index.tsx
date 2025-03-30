import ModalSheet from 'components/modalSheet';
import { overlay } from 'overlay-kit';
import {
  LangOptionValues,
  useVoiceDictationContext
} from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { useAppDispatch } from 'store/store';

import * as S from './style';

interface Props {
  isOpened: boolean;
  setIsOpened: (isOpen: boolean) => void;
}

const languages: LangOptionValues[] = ['ko-KR', 'en-US', 'ja', 'zh-cn', 'zh-tw', 'enko'];

export default function MobileLangSelector({ isOpened, setIsOpened }: Props) {
  const {
    sharedVoiceDictationInfo: { selectedLangOption },
    setSharedVoiceDictationInfo
  } = useVoiceDictationContext();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const findLabelKeyByLangValue = (lang: LangOptionValues): string => {
    switch (lang) {
      case 'ko-KR':
        return 'Korean';
      case 'en-US':
        return 'English';
      case 'ja':
        return 'Japanese';
      case 'zh-cn':
        return 'Chinese1';
      case 'zh-tw':
        return 'Chinese2';
      case 'enko':
        return 'KoEn';
      default:
        return 'Korean'; // 기본값
    }
  };

  const openToastPopup = (lang: LangOptionValues) => {
    const langLabel = t(
      `Nova.voiceDictation.LanguageSelector.Options.${findLabelKeyByLangValue(lang)}`
    );

    dispatch(
      activeToast({
        type: 'info',
        msg: t('Nova.voiceDictation.LanguageSelector.ChangeNotice', { lang: langLabel }).replace(
          '&amp;',
          '&'
        )
      })
    );
  };

  const handleSelectLanguage = (language: LangOptionValues) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      selectedLangOption: language
    }));
  };

  const handleLanguageSelect = (language: LangOptionValues) => {
    handleSelectLanguage(language);
    openToastPopup(language);
    overlay.closeAll();
  };

  return (
    <ModalSheet isOpen={isOpened} setIsOpen={setIsOpened} detent="content-height">
      <S.SheetContainer>
        <S.LanguageOptionsContainer>
          {languages.map((language) => (
            <S.LanguageItem
              key={language}
              isSelected={selectedLangOption === language}
              onClick={() => handleLanguageSelect(language)}>
              <S.LanguageText isSelected={selectedLangOption === language}>
                {t(
                  `Nova.voiceDictation.LanguageSelector.Options.${findLabelKeyByLangValue(language)}`
                )}
              </S.LanguageText>
            </S.LanguageItem>
          ))}
        </S.LanguageOptionsContainer>
        <S.BottomDescription>선택한 언어로 기록합니다.</S.BottomDescription>
      </S.SheetContainer>
    </ModalSheet>
  );
}
