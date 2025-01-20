import styled from 'styled-components';

export const Wrapper = styled.div<{ isScroll: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Body = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.bg};
`;
