import styled from 'styled-components';

const ModalContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  margin-bottom: 36px;
  color: #454c53;
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

export { Button, ButtonGroup, ModalContainer, SubTitle };
