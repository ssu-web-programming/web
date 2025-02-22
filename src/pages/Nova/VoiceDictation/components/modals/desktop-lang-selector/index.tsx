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

import { langOptions } from '../../recognized-lang';

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

  const findLabelByLangOptions = (lang: LangOptionValues) => {
    return langOptions.find((langOption) => langOption.value === lang)?.label;
  };

  const openToastPopup = (lang: LangOptionValues) => {
    dispatch(
      activeToast({
        type: 'info',
        msg: `인식 언어가 ${findLabelByLangOptions(lang)}로 변경되었어요!`
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
      <S.ModalTitle>인식 언어</S.ModalTitle>
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
