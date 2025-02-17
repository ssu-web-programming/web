import styled from 'styled-components';

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.color.background.gray05};
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.color.text.gray04};
  margin-bottom: 8px;
`;

const ModalSubTitle = styled.p`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.color.text.gray03};
  font-weight: 400;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 0;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })<{
  $isLightMode: boolean;
}>`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  cursor: pointer;
  position: relative;

  &:checked {
    border-color: ${({ theme }) => theme.color.background.purple01};
    background: ${({ theme }) => theme.color.background.purple01};
    /* 호진FIXME: 이미지로 변경v! */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    background-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const RadioText = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.color.text.gray03};
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

export {
  Button,
  ButtonGroup,
  ModalContainer,
  ModalSubTitle,
  ModalTitle,
  RadioGroup,
  RadioInput,
  RadioLabel,
  RadioText
};
