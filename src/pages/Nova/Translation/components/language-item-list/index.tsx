import {
  SOURCE_LANGUAGES_WITH_LANG_CODE,
  TARGET_LANGUAGES_WITH_LANG_CODE
} from 'constants/translation-text';
import styled from 'styled-components';

import { LangType } from '../../provider/translation-provider';
import { Language } from '../language-search';

interface LanguageItemProps {
  value: string;
}

interface Props {
  title: string;
  langList: Language[];
  latestLangList?: string[];
  langType: LangType;
}

function LanguageItem({ value }: LanguageItemProps) {
  return <S.LanguageItem>{value}</S.LanguageItem>;
}

export default function LanguageItemList({ langList, title, latestLangList, langType }: Props) {
  const findLatestLangList = () => {
    return latestLangList?.map((latestLang) => {
      const baseCode = latestLang.toUpperCase();
      const langTypeWithCode =
        langType === 'source' ? SOURCE_LANGUAGES_WITH_LANG_CODE : TARGET_LANGUAGES_WITH_LANG_CODE;
      const findLang = langTypeWithCode.find((item) => item.langCode === baseCode);

      return findLang?.lang;
    });
  };

  if (!langList.length) {
    return <S.LanguageNoSearch>결과 없음</S.LanguageNoSearch>;
  }

  return (
    <>
      {/* 시간이 좀 오래걸려서 UX적인 처리가필요할듯 */}
      <S.LanguageTitle>최근에 사용한 언어</S.LanguageTitle>
      <S.LanguageItem>{findLatestLangList()}</S.LanguageItem>

      <S.LanguageTitle>{title}</S.LanguageTitle>
      {langList.map((lang, idx) => (
        <LanguageItem key={idx} value={lang.lang} />
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
