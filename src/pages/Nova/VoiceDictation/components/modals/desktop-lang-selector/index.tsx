import { ChangeEvent, useState } from 'react';
import { overlay } from 'overlay-kit';
import {
  LangOptionValues,
  useVoiceDictationContext
} from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { activeToast } from 'store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from 'store/store';

import * as S from './style';

export default function DesktopLangSelector() {
  const {
    sharedVoiceDictationInfo: { selectedLangOption },
    setSharedVoiceDictationInfo
  } = useVoiceDictationContext();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [tempSelectedLang, setTempSelectedLang] = useState<LangOptionValues>(selectedLangOption);
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

  const handleSetSelectedLangOption = (lang: LangOptionValues) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      selectedLangOption: lang
    }));
  };

  const handleChangeLang = (e: ChangeEvent<HTMLInputElement>) => {
    const lang = e.target.value as LangOptionValues;
    setTempSelectedLang(lang);
  };

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    handleSetSelectedLangOption(tempSelectedLang);
    openToastPopup(tempSelectedLang);
    handleClose();
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>{t('Nova.voiceDictation.Button.Recognition')}</S.ModalTitle>
      <S.ModalSubTitle>{t('Nova.voiceDictation.Guide.LanguageConversion')}</S.ModalSubTitle>

      <S.RadioGroup>
        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="ko-KR"
            value="ko-KR"
            checked={tempSelectedLang === 'ko-KR'}
            onChange={handleChangeLang}
          />
          <S.RadioText>{t('Nova.voiceDictation.LanguageSelector.Options.Korean')}</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="en-US"
            value="en-US"
            checked={tempSelectedLang === 'en-US'}
            onChange={handleChangeLang}
          />
          <S.RadioText>{t('Nova.voiceDictation.LanguageSelector.Options.English')}</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="ja"
            value="ja"
            checked={tempSelectedLang === 'ja'}
            onChange={handleChangeLang}
          />
          <S.RadioText>{t('Nova.voiceDictation.LanguageSelector.Options.Japanese')}</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="zh-cn"
            value="zh-cn"
            checked={tempSelectedLang === 'zh-cn'}
            onChange={handleChangeLang}
          />
          <S.RadioText>{t('Nova.voiceDictation.LanguageSelector.Options.Chinese1')}</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="zh-tw"
            value="zh-tw"
            checked={tempSelectedLang === 'zh-tw'}
            onChange={handleChangeLang}
          />
          <S.RadioText>{t('Nova.voiceDictation.LanguageSelector.Options.Chinese2')}</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="enko"
            value="enko"
            checked={tempSelectedLang === 'enko'}
            onChange={handleChangeLang}
          />
          <S.RadioText>{t('Nova.voiceDictation.LanguageSelector.Options.KoEn')}</S.RadioText>
        </S.RadioLabel>
      </S.RadioGroup>

      <S.ButtonGroup>
        <S.Button onClick={handleClose}>{t('Nova.voiceDictation.Button.Cancel')}</S.Button>
        <S.Button primary onClick={handleSave}>
          {t('Nova.voiceDictation.Button.Confirm')}
        </S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
