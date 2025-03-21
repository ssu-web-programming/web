import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ModalSheet from 'components/modalSheet';
import {
  FILE_SOURCE_LANGUAGES_WITH_LANG_CODE,
  FILE_TARGET_LANGUAGES_WITH_LANG_CODE,
  SOURCE_LANGUAGES_WITH_LANG_CODE,
  TARGET_LANGUAGES_WITH_LANG_CODE
} from 'constants/translation-text';
import { ReactComponent as SearchIcon } from 'img/light/nova/translation/search.svg';
import { useTranslation } from 'react-i18next';
import getInitialConsonant from 'util/getInitialConsonant';

import useLangSearch from '../../hooks/use-lang-search';
import { LangType, SharedTranslation } from '../../provider/translation-provider';
import LanguageItemList from '../language-item-list';
import { TranslateType } from '../translation-intro';

import * as S from './style';

interface Props {
  isOpen: boolean;
  close: () => void;
  langType: LangType;
  setSharedTranslationInfo: Dispatch<SetStateAction<SharedTranslation>>;
  btnType: TranslateType;
}

export interface Language {
  langCode: string;
  lang: string;
}

export default function LanguageSearch({
  isOpen,
  close,
  langType,
  setSharedTranslationInfo,
  btnType
}: Props) {
  const { t, i18n } = useTranslation();

  const getInitialLanguages = () => {
    if (langType === 'source' && btnType === 'TEXT') {
      return SOURCE_LANGUAGES_WITH_LANG_CODE;
    }

    if (langType === 'source' && btnType === 'FILE') {
      return FILE_SOURCE_LANGUAGES_WITH_LANG_CODE;
    }

    if (langType === 'target' && btnType === 'FILE') {
      return FILE_TARGET_LANGUAGES_WITH_LANG_CODE;
    }

    return TARGET_LANGUAGES_WITH_LANG_CODE;
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const { latestLangList } = useLangSearch(langType);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // 검색 결과 필터링
  const filteredLanguages = useMemo(() => {
    const searchValue = searchTerm.toLowerCase();

    // 먼저 검색어에 맞는 언어 필터링
    const filtered = getInitialLanguages().filter((language) => {
      const { lang, langCode } = language;

      // 1. 일반 검색 (대소문자 구분 없이)
      const normalMatch = lang.toLowerCase().includes(searchValue);

      // 2. 초성 검색
      const initialConsonant = getInitialConsonant(lang);
      const consonantMatch = initialConsonant.includes(searchTerm);

      // 3. 영어 검색 (예: '영어' 또는 'english')
      const englishMatch =
        lang.toLowerCase().includes(searchValue) ||
        lang.toLowerCase().replace('어', '').includes(searchValue);

      // 4. 언어 코드 검색 (예: 'EN', 'KO')
      const langCodeMatch = langCode.toLowerCase().includes(searchValue);

      return normalMatch || consonantMatch || englishMatch || langCodeMatch;
    });

    // i18n 현재 언어 확인
    const currentLang = i18n.language;

    // 언어별 정렬 처리
    switch (currentLang) {
      case 'en':
        // 영어일 경우 알파벳 A-Z 순으로 정렬
        return filtered.sort((a, b) => a.lang.localeCompare(b.lang, 'en'));
      case 'ja':
        // 일본어일 경우 가나 순(あいうえお)으로 정렬
        return filtered.sort((a, b) => a.lang.localeCompare(b.lang, 'ja'));
      case 'ko':
      default:
        // 한국어나 기타 언어일 경우 한국어 기준으로 정렬
        return filtered.sort((a, b) => a.lang.localeCompare(b.lang, 'ko'));
    }
  }, [searchTerm, i18n.language, getInitialLanguages]);
  return (
    <ModalSheet isOpen={isOpen} setIsOpen={close} snapPoints={[0.8]} initialSnap={0}>
      <S.Wrapper>
        <S.Title>
          {langType === 'source'
            ? t('Nova.translation.Language.Source')
            : t('Nova.translation.Language.Target')}
        </S.Title>
        <S.InputWrapper>
          <S.SearchInput
            placeholder={t('Nova.translation.Button.LanguageSearch') as string}
            value={searchTerm}
            onChange={handleSearch}
          />
          <SearchIcon />
        </S.InputWrapper>

        <LanguageItemList
          langList={filteredLanguages}
          latestLangList={latestLangList}
          langType={langType}
          setSharedTranslationInfo={setSharedTranslationInfo}
          close={close}
        />
      </S.Wrapper>
    </ModalSheet>
  );
}
