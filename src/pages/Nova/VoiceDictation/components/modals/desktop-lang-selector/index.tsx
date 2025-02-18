import { ChangeEvent } from 'react';
import { overlay } from 'overlay-kit';
import {
  LangOptionValues,
  useVoiceDictationContext
} from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
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

    handleSetSelectedLangOption(lang);
  };

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    openToastPopup(selectedLangOption);
    handleClose();
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>인식 언어</S.ModalTitle>
      <S.ModalSubTitle>선택한 언어로 기록합니다.</S.ModalSubTitle>

      <S.RadioGroup>
        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="ko-KR"
            value="ko-KR"
            checked={selectedLangOption === 'ko-KR'}
            onChange={handleChangeLang}
          />
          <S.RadioText>한국어</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="en-US"
            value="en-US"
            checked={selectedLangOption === 'en-US'}
            onChange={handleChangeLang}
          />
          <S.RadioText>영어</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="ja"
            value="ja"
            checked={selectedLangOption === 'ja'}
            onChange={handleChangeLang}
          />
          <S.RadioText>일본어</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="zh-cn"
            value="zh-cn"
            checked={selectedLangOption === 'zh-cn'}
            onChange={handleChangeLang}
          />
          <S.RadioText>중국어(간체)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="zh-tw"
            value="zh-tw"
            checked={selectedLangOption === 'zh-tw'}
            onChange={handleChangeLang}
          />
          <S.RadioText>중국어(번체)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            $isLightMode={isLightMode}
            type="radio"
            name="enko"
            value="enko"
            checked={selectedLangOption === 'enko'}
            onChange={handleChangeLang}
          />
          <S.RadioText>한국어+영어</S.RadioText>
        </S.RadioLabel>
      </S.RadioGroup>

      <S.ButtonGroup>
        <S.Button onClick={handleClose}>취소</S.Button>
        <S.Button primary onClick={handleSave}>
          확인
        </S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
