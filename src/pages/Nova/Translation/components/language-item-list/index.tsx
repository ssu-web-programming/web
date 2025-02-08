import { Dispatch, SetStateAction } from 'react';
import {
  SOURCE_LANGUAGES_WITH_LANG_CODE,
  TARGET_LANGUAGES_WITH_LANG_CODE
} from 'constants/translation-text';
import styled from 'styled-components';

import { LangType, SharedTranslation } from '../../provider/translation-provider';
import { Language } from '../language-search';

interface LanguageItemProps {
  value: string;
  onClick: () => void;
}

interface Props {
  langList: Language[];
  latestLangList?: string[];
  langType: LangType;
  setSharedTranslationInfo: Dispatch<SetStateAction<SharedTranslation>>;
  close: () => void;
}

function LanguageItem({ value, onClick }: LanguageItemProps) {
  return <S.LanguageItem onClick={onClick}>{value}</S.LanguageItem>;
}

export default function LanguageItemList({
  langList,
  latestLangList,
  langType,
  setSharedTranslationInfo,
  close
}: Props) {
  const findLatestLangList = () => {
    return latestLangList?.map((latestLang) => {
      const baseCode = latestLang.toUpperCase();
      const langTypeWithCode =
        langType === 'source' ? SOURCE_LANGUAGES_WITH_LANG_CODE : TARGET_LANGUAGES_WITH_LANG_CODE;
      const findLang = langTypeWithCode.find((item) => item.langCode === baseCode);

      return findLang?.lang;
    });
  };

  const checkSwitchState = (langCode: string) => {
    const langTypeWithCode =
      langType === 'source' ? TARGET_LANGUAGES_WITH_LANG_CODE : SOURCE_LANGUAGES_WITH_LANG_CODE;

    return !!langTypeWithCode.find((targetLang) => targetLang.langCode === langCode);
  };

  const handleSetLangCode = (langCode: string) => {
    setSharedTranslationInfo((prev) => ({
      ...prev,
      [langType === 'source' ? 'sourceLang' : 'targetLang']: langCode,
      isSwitchActive: checkSwitchState(langCode)
    }));
    close();
  };

  if (!langList.length) {
    return <S.LanguageNoSearch>결과 없음</S.LanguageNoSearch>;
  }

  return (
    <>
      {/* 시간이 좀 오래걸려서 UX적인 처리가 필요할듯 */}
      <S.LanguageTitle>최근에 사용한 언어</S.LanguageTitle>
      <S.LanguageItem>{findLatestLangList()}</S.LanguageItem>

      <S.LanguageTitle>모든 언어</S.LanguageTitle>
      {langList.map((lang, idx) => (
        <LanguageItem
          key={idx}
          value={lang.lang}
          onClick={() => handleSetLangCode(lang.langCode)}
        />
      ))}
    </>
  );
}

const S = {
  LanguageTitle: styled.p`
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    text-align: left;
    margin-top: 16px;
    color: #9ea4aa;
  `,
  LanguageItem: styled.p`
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #454c53;
  `,
  LanguageNoSearch: styled.p`
    margin-top: 28px;
    text-align: center;
    color: #9ea4aa;
  `
};
