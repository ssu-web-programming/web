import { overlay } from 'overlay-kit';
import {
  LangOptionValues,
  useVoiceDictationContext
} from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';

import * as S from './style';

export default function DesktopLangSelector() {
  const {
    sharedVoiceDictationInfo: { selectedLangOption },
    setSharedVoiceDictationInfo
  } = useVoiceDictationContext();

  const handleSetSelectedLangOption = (lang: LangOptionValues) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      selectedLangOption: lang
    }));
  };

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    handleClose();
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>인식 언어</S.ModalTitle>

      <S.RadioGroup>
        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="ko-KR"
            value="ko-KR"
            checked={selectedLangOption === 'ko-KR'}
            onChange={(e) => handleSetSelectedLangOption(e.target.value as LangOptionValues)}
          />
          <S.RadioText>한국어</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="en-US"
            value="en-US"
            checked={selectedLangOption === 'en-US'}
            onChange={(e) => handleSetSelectedLangOption(e.target.value as LangOptionValues)}
          />
          <S.RadioText>영어</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="ja"
            value="ja"
            checked={selectedLangOption === 'ja'}
            onChange={(e) => handleSetSelectedLangOption(e.target.value as LangOptionValues)}
          />
          <S.RadioText>일본어</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="zh-cn"
            value="zh-cn"
            checked={selectedLangOption === 'zh-cn'}
            onChange={(e) => handleSetSelectedLangOption(e.target.value as LangOptionValues)}
          />
          <S.RadioText>중국어(간체)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="zh-tw"
            value="zh-tw"
            checked={selectedLangOption === 'zh-tw'}
            onChange={(e) => handleSetSelectedLangOption(e.target.value as LangOptionValues)}
          />
          <S.RadioText>중국어(번체)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="enko"
            value="enko"
            checked={selectedLangOption === 'enko'}
            onChange={(e) => handleSetSelectedLangOption(e.target.value as LangOptionValues)}
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
