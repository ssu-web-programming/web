import styled from 'styled-components';

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.color.background.gray05};
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
`;

const Title = styled.p`
  font-size: 18px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

const SubTitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  margin-bottom: 36px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  & > :nth-child(1) {
    flex-grow: 1;
  }

  & > :nth-child(2) {
    flex-grow: 3;
  }
`;

const Button = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  ${(props) =>
    props.primary
      ? `
    background-color: ${props.theme.color.main};
    color: white;
    
    &:hover {
      background-color:${props.theme.color.main};
    }
  `
      : `
    background-color: ${props.theme.color.background.gray02};
    color: ${props.theme.color.text.gray03};
    
    &:hover {
      background-color: ${props.theme.color.background.gray02};
    }
  `}
`;

export { Button, ButtonGroup, ModalContainer, SubTitle, Title };
