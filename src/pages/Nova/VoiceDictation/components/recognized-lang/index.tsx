import Select from 'components/select';
import styled, { css } from 'styled-components';

import {
  LangOptionValues,
  useVoiceDictationContext
} from '../../provider/voice-dictation-provider';

type Option = {
  value: LangOptionValues;
  label: string;
};

export const langOptions: Option[] = [
  { value: 'ko-KR', label: '한국어' },
  { value: 'en-US', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh-cn', label: '중국어(간체)' },
  { value: 'zh-tw', label: '중국어(번체)' },
  { value: 'enko', label: '한국어+영어' }
];

export default function RecognizedLang() {
  const {
    setSharedVoiceDictationInfo,
    sharedVoiceDictationInfo: { selectedLangOption }
  } = useVoiceDictationContext();

  return (
    <S.SelectWrapper>
      <Select<LangOptionValues>
        options={langOptions}
        value={selectedLangOption}
        onChange={(result) => {
          setSharedVoiceDictationInfo((prev) => ({
            ...prev,
            selectedLangOption: result
          }));
        }}
        $optionContainerStyle={css`
          transform: translateX(-50%);
          left: 40%;
          width: 160px;
        `}
      />
    </S.SelectWrapper>
  );
}

const S = {
  SelectWrapper: styled.div`
    display: inline-block;
    margin: 0 auto;
    padding: 7.5px 7.5px 7.5px 16px;
    border: 1px solid ${({ theme }) => theme.color.border.gray01};
    background: ${({ theme }) => theme.color.background.gray01};
    border-radius: 8px;
    margin-bottom: 32px;
  `
};
