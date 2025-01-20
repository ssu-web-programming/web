import { ReactNode } from 'react';
import NovaHeader from 'components/nova/Header';

import { ComponentType, useTranslationContext } from '../../provider/translation-provider';
import BgContainer from '../bg-container';
import LanguageSearch from '../language-search';
import TranslationFileResult from '../translation-file-result';
import TranslationIntro from '../translation-intro';
import TranslationTextResult from '../translation-text-result';

import * as S from './style';

export default function TranslationContent() {
  const {
    sharedTranslationInfo: { componentType }
  } = useTranslationContext();

  const componentMap: Record<ComponentType, ReactNode> = {
    INTRO: <TranslationIntro />,
    TEXT_RESULT: <TranslationTextResult />,
    FILE_RESULT: <TranslationFileResult />,
    LANG_SEARCH: <LanguageSearch />
  };

  return (
    <S.TranslationWrapper>
      <NovaHeader />
      <BgContainer>{componentMap[componentType]}</BgContainer>
    </S.TranslationWrapper>
  );
}
