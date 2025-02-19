import Select from 'components/select';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
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

export const getLangOptions = (t: TFunction) =>
  [
    { value: 'ko-KR', label: t('Nova.voiceDictation.LanguageSelector.Options.Korean') },
    { value: 'en-US', label: t('Nova.voiceDictation.LanguageSelector.Options.English') },
    { value: 'ja', label: t('Nova.voiceDictation.LanguageSelector.Options.Japanese') },
    { value: 'zh-cn', label: t('Nova.voiceDictation.LanguageSelector.Options.Chinese1') },
    { value: 'zh-tw', label: t('Nova.voiceDictation.LanguageSelector.Options.Chinese2') },
    { value: 'enko', label: t('Nova.voiceDictation.LanguageSelector.Options.KoEn') }
  ] as Option[];

export default function RecognizedLang() {
  const {
    setSharedVoiceDictationInfo,
    sharedVoiceDictationInfo: { selectedLangOption }
  } = useVoiceDictationContext();
  const { t } = useTranslation();
  const options = getLangOptions(t);

  return (
    <S.SelectWrapper>
      <Select<LangOptionValues>
        options={options}
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
