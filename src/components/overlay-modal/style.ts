import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  width: 90%;
  max-width: 400px;
  border-radius: 16px;
  padding: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 0;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  cursor: pointer;
  position: relative;

  &:checked {
    border-color: #7c3aed;

    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: #7c3aed;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const RadioText = styled.span`
  font-size: 16px;
  color: #1a1a1a;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
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
    background-color: #7c3aed;
    color: white;
    
    &:hover {
      background-color: #6d28d9;
    }
  `
      : `
    background-color: #f3f4f6;
    color: #4b5563;
    
    &:hover {
      background-color: #e5e7eb;
    }
  `}
`;

export {
  Button,
  ButtonGroup,
  ModalContainer,
  ModalTitle,
  ModalWrapper,
  RadioGroup,
  RadioInput,
  RadioLabel,
  RadioText
};
