import styled from 'styled-components';

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.color.background.gray05};
  width: 100%;
  max-width: calc(100% - 16px);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  gap: 36px;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.p`
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const Message = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray03};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  & > :nth-child(1) {
    flex-grow: 1;
  }

  & > :nth-child(2) {
    flex-grow: 3;
  }
`;
