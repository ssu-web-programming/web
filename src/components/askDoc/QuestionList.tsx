import styled, { css } from 'styled-components';
import {
  alignItemCenter,
  alignItemStart,
  flex,
  flexColumn,
  justiCenter,
  justiStart
} from '../../style/cssCommon';
import Button from '../buttons/Button';
import Icon from '../Icon';
import icon_credit from '../../img/ico_credit.svg';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/store';
import { summarySelector } from '../../store/slices/askDocSummary';

const Title = styled.div`
  color: var(--ai-purple-50-main);
  font-size: 13px;
  font-weight: 500;
`;

const Summary = styled.div`
  ${flex}
  ${flexColumn}
  
  gap: 12px;
`;

const SubTitle = styled.div`
  ${flex}
  ${alignItemCenter}
  ${justiStart}
  
  padding: 9px 0 8px 0;
  color: #72787f;
  font-size: 12px;
  font-weight: 500;
`;

const KeywordWrap = styled.div`
  ${flex}
  ${alignItemStart}
  
  gap: 8px;
  flex-wrap: wrap;
`;

const Keyword = styled.div<{ disable: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${justiCenter}
  
  padding: 4px 10px;
  border-radius: 4px;
  background-color: #f2f4f6;

  opacity: ${(props) => (props.disable ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disable ? 'none' : 'auto')};
  cursor: ${(props) => (props.disable ? 'auto' : 'pointer')};
`;

const List = styled.div`
  ${flex}
  ${flexColumn}
  
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
  onClick: (api: 'gpt' | 'askDoc', chatText?: string) => {};
}) => {
  const { t } = useTranslation();
  const { keywords, questions, summary } = useAppSelector(summarySelector);

  return (
    <>
      {questions?.length > 0 && (
        <>
          <Title>{t('AskDoc.InitLoadInfoMention')}</Title>
          {isIncludeSummary && (
            <Summary>
              <div>
                <SubTitle>핵심 요약</SubTitle>
                <div>{summary}</div>
              </div>
              <div>
                <SubTitle>키워드</SubTitle>
                <KeywordWrap>
                  {keywords.map((keyword, index) => {
                    return (
                      <Keyword
                        key={index}
                        onClick={() => {
                          onClick('askDoc', `${keyword}에 대해서 설명해줘`);
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
            <SubTitle>문서 내 추천 질문</SubTitle>
            {questions?.map((q) => (
              <Button
                disable={isLoading}
                key={q}
                width={'full'}
                height={'full'}
                variant="gray"
                cssExt={css`
                  ${justiStart}
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
