import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import icon_credit from '../../img/light/ico_credit_purple.svg';
import { summarySelector } from '../../store/slices/askDocSummary';
import { useAppSelector } from '../../store/store';
import Button from '../buttons/Button';
import Icon from '../Icon';

const Title = styled.div`
  color: var(--ai-purple-50-main);
  font-size: 13px;
  font-weight: 500;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;

  gap: 12px;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 9px 0 8px 0;
  color: #72787f;
  font-size: 12px;
  font-weight: 500;
`;

const KeywordWrap = styled.div`
  display: flex;
  align-items: flex-start;

  gap: 8px;
  flex-wrap: wrap;
`;

const Keyword = styled.div<{ disable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;
  border-radius: 4px;
  background-color: #f2f4f6;

  opacity: ${(props) => (props.disable ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disable ? 'none' : 'auto')};
  cursor: ${(props) => (props.disable ? 'auto' : 'pointer')};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;

  gap: 6px;
  height: 100%;
  width: 100%;
`;

export const QuestionList = ({
  isLoading,
  isIncludeSummary,
  onClick
}: {
  isLoading: boolean;
  isIncludeSummary: boolean;
  onClick: (api: 'gpt' | 'askDoc', chatText?: string) => void;
}) => {
  const { t } = useTranslation();
  const { keywords, questions, summary } = useAppSelector(summarySelector);

  return (
    <>
      {questions?.length > 0 && (
        <>
          <Title>{t('AskDoc.InitLoadInfoContent')}</Title>
          {isIncludeSummary && (
            <Summary>
              <div>
                <SubTitle>{t('AskDoc.Summary')}</SubTitle>
                <div>{summary}</div>
              </div>
              <div>
                <SubTitle>{t('AskDoc.Keyword')}</SubTitle>
                <KeywordWrap>
                  {keywords.map((keyword, index) => {
                    return (
                      <Keyword
                        key={index}
                        onClick={() => {
                          onClick('askDoc', t(`AskDoc.AnswerKeyword`, { keyword: keyword })!);
                        }}
                        disable={isLoading}>
                        {`#${keyword}`}
                      </Keyword>
                    );
                  })}
                </KeywordWrap>
              </div>
            </Summary>
          )}
          <List>
            <SubTitle>{t('AskDoc.Questions')}</SubTitle>
            {questions?.map((q) => (
              <Button
                disable={isLoading}
                key={q}
                width={'full'}
                height={'full'}
                variant="gray"
                cssExt={css`
                  justify-content: flex-start;
                `}
                onClick={() => {
                  onClick('askDoc', q);
                }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ margin: '0px 6px', height: '100%' }}>
                    <Icon size={'sm'} iconSrc={icon_credit} />
                  </div>
                  <div style={{ textAlign: 'left' }}>{q}</div>
                </div>
              </Button>
            ))}
          </List>
        </>
      )}
    </>
  );
};
