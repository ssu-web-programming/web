import styled from 'styled-components';

import translation from '../../../api/translation';

export const Wrapper = styled.div<{ isPerplexity: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1 1 0;
  gap: 12px;
  flex-direction: column;
  padding: 24px 16px;
  overflow-y: auto;
  background-color: ${({ isPerplexity, theme }) =>
    isPerplexity ? theme.color.background.yellow01 : translation};
`;

export const ChatItem = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const Chat = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  p {
    font-size: 16px;
  }
`;

export const Question = styled(Chat)`
  align-items: flex-start;

  p {
    font-weight: 500;
    line-height: 25.6px;
  }
`;

export const QuestionContents = styled.div`
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 3px;
  word-wrap: break-word;
`;

export const Answer = styled(Chat)`
  width: 100%;
  align-items: flex-start;

  p {
    font-weight: 400;
    line-height: 24px;
  }
`;

export const ChatButtonWrapper = styled.div`
  width: 100%;
  height: 34px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-top: 12px;

  button > div {
    gap: 4px;
  }
`;

export const FileItem = styled.div`
  width: fit-content;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.gray04};

  font-size: 14px;
  line-height: 21px;
  text-align: left;

  &:hover {
    background-color: #c9cdd2;
    cursor: pointer;
  }
`;

export const MakeNewImageGuide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  overflow: hidden;
`;

export const MakeNewImageMessage = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.color.text.main};
`;
