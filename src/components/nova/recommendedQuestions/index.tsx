import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import PlusIcon from '../../../img/common/ico_plus_cyan.svg';

import * as S from './style';

interface recommendedQuestionsProps {
  questions: string[];
  setInputContents: Dispatch<React.SetStateAction<string>>;
}

export default function RecommendedQuestions({
  questions,
  setInputContents
}: recommendedQuestionsProps) {
  const { t } = useTranslation();

  return (
    <S.Container>
      <S.Title>{t('Nova.perplexity.recommendQuestion')}</S.Title>
      <S.Questions>
        {questions.map((question, index) => (
          <>
            <div key={index} className="item">
              <span>{question}</span>
              <img src={PlusIcon} alt="plus" onClick={() => setInputContents(question)} />
            </div>
            <div className="driver" />
          </>
        ))}
      </S.Questions>
    </S.Container>
  );
}
