import { Dispatch, SetStateAction } from 'react';
import {
  SOURCE_LANGUAGES_WITH_LANG_CODE,
  TARGET_LANGUAGES_WITH_LANG_CODE
} from 'constants/translation-text';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  ChineseVariant,
  EnglishVariant,
  getBaseLanguage,
  isLanguageVariant,
  LANGUAGE_VARIANTS,
  PortugueseVariant
} from '../../hooks/use-translation-intro';
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
  const { t } = useTranslation();
  const findLatestLangList = () => {
    return latestLangList?.map((latestLang) => {
      const baseCode = latestLang.toUpperCase();
      const langTypeWithCode =
        langType === 'source' ? SOURCE_LANGUAGES_WITH_LANG_CODE : TARGET_LANGUAGES_WITH_LANG_CODE;
      const findLang = langTypeWithCode.find((item) => item.langCode === baseCode);
      return findLang;
    });
  };

  const checkSwitchState = (langCode: string) => {
    const langTypeWithCode =
      langType === 'source' ? SOURCE_LANGUAGES_WITH_LANG_CODE : TARGET_LANGUAGES_WITH_LANG_CODE;

    // source 언어가 기본 형태(EN, ZH, PT)인 경우
    if (langType === 'source') {
      if (langCode === 'EN') {
        return !!TARGET_LANGUAGES_WITH_LANG_CODE.find((lang) =>
          LANGUAGE_VARIANTS.EN.includes(lang.langCode as EnglishVariant)
        );
      }
      if (langCode === 'ZH') {
        return !!TARGET_LANGUAGES_WITH_LANG_CODE.find((lang) =>
          LANGUAGE_VARIANTS.ZH.includes(lang.langCode as ChineseVariant)
        );
      }
      if (langCode === 'PT') {
        return !!TARGET_LANGUAGES_WITH_LANG_CODE.find((lang) =>
          LANGUAGE_VARIANTS.PT.includes(lang.langCode as PortugueseVariant)
        );
      }
    }

    // target 언어가 변형(EN-US/GB, ZH-HANS/HANT, PT-BR/PT)인 경우
    if (langType === 'target') {
      const baseLang = getBaseLanguage(langCode);
      if (baseLang) {
        return !!SOURCE_LANGUAGES_WITH_LANG_CODE.find((lang) => lang.langCode === baseLang);
      }
    }

    // 그 외의 경우는 기존 로직대로 처리
    return !!langTypeWithCode.find((targetLang) => targetLang.langCode === langCode);
  };

  const handleSetLangCode = (langCode: string) => {
    setSharedTranslationInfo((prev) => ({
      ...prev,
      [langType === 'source' ? 'sourceLang' : 'targetLang']: langCode,
      // 언어 변형 코드 저장
      ...(langType === 'target' && isLanguageVariant(langCode)
        ? { previousVariant: langCode }
        : {}),
      isSwitchActive: checkSwitchState(langCode)
    }));
    close();
  };

  if (!langList.length) {
    return <S.LanguageNoSearch>{t('Nova.translation.Guide.NoResults')}</S.LanguageNoSearch>;
  }

  return (
    <>
      {/* 시간이 좀 오래걸려서 UX적인 처리가 필요할듯 */}
      <S.LanguageTitle>{t('Nova.translation.Menu.RecentLanguages')}</S.LanguageTitle>

      {findLatestLangList()?.map((lang, idx) => (
        <S.LanguageItem key={idx} onClick={() => handleSetLangCode(lang!.langCode)}>
          {lang?.lang}
        </S.LanguageItem>
      ))}

      <S.LanguageTitle>{t('Nova.translation.Menu.AllLanguages')}</S.LanguageTitle>
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
    color: ${({ theme }) => theme.color.text.gray04};
  `,
  LanguageNoSearch: styled.p`
    margin-top: 28px;
    text-align: center;
    color: ${({ theme }) => theme.color.text.gray04};
  `
};
