import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 16px);
  height: fit-content;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 24px;
  background-color: ${({ theme }) => theme.color.background.gray05};
  z-index: 100;
  box-shadow: 0 8px 16px 0 #0000001a;
  border-radius: 16px;
`;

export const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;
