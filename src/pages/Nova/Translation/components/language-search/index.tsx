import { useEffect, useMemo, useState } from 'react';
import { TARGET_LANGUAGES } from 'constants/translation-text';
import { ReactComponent as SearchIcon } from 'img/light/nova/translation/search.svg';
import getInitialConsonant from 'util/getInitialConsonant';

import LanguageItemList from '../language-item-list';

import * as S from './style';

export default function LanguageSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredLanguages, setFilteredLanguages] = useState(TARGET_LANGUAGES);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // 검색 결과 필터링
  const filteredResults = useMemo(() => {
    const searchValue = searchTerm.toLowerCase();

    return TARGET_LANGUAGES.filter((language) => {
      // 1. 일반 검색 (대소문자 구분 없이)
      const normalMatch = language.toLowerCase().includes(searchValue);

      // 2. 초성 검색
      const initialConsonant = getInitialConsonant(language);
      const consonantMatch = initialConsonant.includes(searchTerm);

      // 3. 영어 검색 (예: '영어' 또는 'english')
      const englishMatch =
        language.toLowerCase().includes(searchValue) ||
        language.toLowerCase().replace('어', '').includes(searchValue);

      return normalMatch || consonantMatch || englishMatch;
    });
  }, [searchTerm]);

  // 검색 결과 업데이트
  useEffect(() => {
    setFilteredLanguages(filteredResults);
  }, [filteredResults]);

  return (
    <S.Wrapper>
      <S.Title>원본 언어</S.Title>
      <S.InputWrapper>
        <S.SearchInput placeholder="언어 검색" value={searchTerm} onChange={handleSearch} />
        <SearchIcon />
      </S.InputWrapper>

      <LanguageItemList
        title={searchTerm ? '검색 결과' : '모든 언어'}
        langList={filteredLanguages}
      />
    </S.Wrapper>
  );
}
