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
  width: 100%;
  padding: 16px 24px 4px;

  .MuiStep-root {
    height: 32px;
    padding: 6px 8px;
    border: 1px solid ${({ theme }) => theme.color.border.gray05};
    border-radius: 6px;
    background-color: ${({ theme }) => theme.color.background.gray01};
  }

  .MuiStepConnector-root {
    width: 47px;
    flex: none;
  }
`;

export const Label = styled(StepLabel)`
  &.MuiStepLabel-root {
    display: flex;
    flex-direction: row;
    gap: 6px;
  }

  .MuiStepLabel-iconContainer {
    width: 16px;
    height: 16px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
  .MuiStepLabel-iconContainer.Mui-active {
    padding: 0;
  }

  .MuiStepLabel-labelContainer {
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
  }

  .MuiSvgIcon-root {
    width: 20px;
    height: 20px;
  }
  .MuiSvgIcon-root.Mui-active {
    color: transparent !important;
    border: 2px solid ${({ theme }) => theme.color.background.purple01};
    border-radius: 99px;

    text {
      fill: ${({ theme }) => theme.color.background.purple01};
      font-size: 1rem;
      font-family: Pretendard, sans-serif;
    }
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
