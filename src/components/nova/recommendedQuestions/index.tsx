import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import PlusIcon from '../../../img/common/ico_plus_cyan.svg';
import {
  selectPageCreditReceived,
  selectPageService
} from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { useAppSelector } from '../../../store/store';
import UseShowSurveyModal from '../../hooks/use-survey-modal';

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
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const showSurveyModal = UseShowSurveyModal();

  return (
    <S.Container>
      <S.Title>{t('Nova.perplexity.recommendQuestion')}</S.Title>
      <S.Questions>
        {questions.map((question, index) => (
          <>
            <div key={index} className="item">
              <span>{question}</span>
              <img
                src={PlusIcon}
                alt="plus"
                onClick={async () => {
                  const isShowModal = await showSurveyModal(
                    selectedNovaTab,
                    service,
                    isCreditRecieved
                  );
                  if (isShowModal) return;

                  setInputContents(question);
                }}
              />
            </div>
            <div className="driver" />
          </>
        ))}
      </S.Questions>
    </S.Container>
  );
}
