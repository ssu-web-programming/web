import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import ModalSheet from 'components/modalSheet';
import {
  SOURCE_LANGUAGES_WITH_LANG_CODE,
  TARGET_LANGUAGES_WITH_LANG_CODE
} from 'constants/translation-text';
import { ReactComponent as SearchIcon } from 'img/light/nova/translation/search.svg';
import { useTranslation } from 'react-i18next';
import getInitialConsonant from 'util/getInitialConsonant';

import useLangSearch from '../../hooks/use-lang-search';
import { LangType, SharedTranslation } from '../../provider/translation-provider';
import LanguageItemList from '../language-item-list';

import * as S from './style';

interface Props {
  isOpen: boolean;
  close: () => void;
  langType: LangType;
  setSharedTranslationInfo: Dispatch<SetStateAction<SharedTranslation>>;
}

export interface Language {
  langCode: string;
  lang: string;
}

export default function LanguageSearch({
  isOpen,
  close,
  langType,
  setSharedTranslationInfo
}: Props) {
  const { t } = useTranslation();
  const initialLanguages =
    langType === 'source' ? SOURCE_LANGUAGES_WITH_LANG_CODE : TARGET_LANGUAGES_WITH_LANG_CODE;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { latestLangList } = useLangSearch(langType);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // 검색 결과 필터링
  const filteredLanguages = useMemo(() => {
    const searchValue = searchTerm.toLowerCase();

    return initialLanguages.filter((language) => {
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
  }, [searchTerm, initialLanguages]);

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
