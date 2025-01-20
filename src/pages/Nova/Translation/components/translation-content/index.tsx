import { ReactNode } from 'react';
import NovaHeader from 'components/nova/Header';

import { ComponentType, useTranslationContext } from '../../provider/translation-provider';
import TranslationIntro from '../translation-intro';

import * as S from './style';

export default function TranslationContent() {
  const {
    sharedTranslationInfo: { componentType }
  } = useTranslationContext();

  const componentMap: Record<ComponentType, ReactNode> = {
    INTRO: <TranslationIntro />,
    TEXT_RESULT: null,
    FILE_RESULT: null
  };

  return (
    <S.TranslationWrapper>
      <NovaHeader />
      {componentMap[componentType]}
    </S.TranslationWrapper>
  );
}
