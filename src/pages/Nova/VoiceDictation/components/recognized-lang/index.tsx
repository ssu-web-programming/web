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
  { value: 'KO', label: '한국어' },
  { value: 'EN', label: '영어' },
  { value: 'JA', label: '일본어' },
  { value: 'ZH-HANS', label: '중국어(간체)' },
  { value: 'ZH-HANT', label: '중국어(번체)' },
  { value: 'KO_EN', label: '한국어+영어' }
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
    border: 1px solid #c9cdd2;
    background: white;
    border-radius: 8px;
    margin-bottom: 32px;
  `
};
