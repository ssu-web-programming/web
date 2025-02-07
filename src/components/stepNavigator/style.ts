import { StepConnector } from '@mui/material';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import styled from 'styled-components';

export const StepWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

interface StepProps {
  isStared?: boolean;
  isFinished?: boolean;
}
export const Step = styled(Stepper).withConfig({
  shouldForwardProp: (prop) => !['isStared', 'isFinished'].includes(prop)
})<StepProps>`
  padding: 16px 24px 4px 24px;
  transform: ${({ isStared, isFinished }) =>
    isStared
      ? 'translateX(calc(50% - 40px))'
      : isFinished
        ? 'translateX(calc(-1 * (50% - 40px)))'
        : 'none'};

  .MuiStep-root {
    padding: 0;
  }
`;

export const Label = styled(StepLabel)`
  &.MuiStepLabel-root {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .MuiStepLabel-iconContainer {
    padding: 5.5px;
  }
  .MuiStepLabel-iconContainer.Mui-active {
    padding: 4px;
  }

  .MuiSvgIcon-root.Mui-active {
    color: #6f3ad0 !important;
  }
`;

export const StepLine = styled(StepConnector)`
  & .MuiStepConnector-line {
    border-color: #d6d6d8;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
