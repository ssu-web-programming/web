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
