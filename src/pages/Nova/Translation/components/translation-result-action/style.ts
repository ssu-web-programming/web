import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.gray01};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray02};

  & > p {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray04};
  }
`;

const IconWrapper = styled.div`
  display: flex;

  & > div > button {
    background: ${({ theme }) => theme.color.background.gray01};

    & > img {
      background: red;
    }
  }
`;

const TextArea = styled.textarea`
  height: 218px;
  padding: 12px 16px;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
  background: ${({ theme }) => theme.color.background.gray01};
  color: ${({ theme }) => theme.color.text.gray04};
  white-space: pre-line;
  resize: none;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 14px;
    background: #ccc;
  }

  &::-webkit-scrollbar-track {
    border-radius: 14px;
  }
`;

export { Header, IconWrapper, TextArea, Wrapper };
