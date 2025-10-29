import styled from 'styled-components';

export const Dim = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
`;

export const LoginWrap = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 8px;
  margin: 48px 16px;
  padding: 12px 12px 12px 24px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.background.gray01};

  p {
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.color.text.gray04};
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: break-word;

    span {
      font-weight: 700;
      color: var(--primary-po-blue-50);
      text-decoration: underline;
      text-decoration-color: var(--primary-po-blue-50);
      text-decoration-thickness: 2px;
      text-underline-offset: 2px;
      cursor: pointer;
    }
  }

  img {
    cursor: pointer;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 16px;
`;
