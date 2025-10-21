import styled from 'styled-components';

export const Wrapper = styled.div<{ isScroll: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Body = styled.div<{ isScroll?: boolean }>`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: ${({ isScroll }) => (isScroll ? 'auto' : 'visible')};
  background-color: ${({ theme }) => theme.color.background.bg};
`;

export const Dim = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
`;

export const LoginWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 48px 16px;
  padding: 12px 24px;
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
`;
