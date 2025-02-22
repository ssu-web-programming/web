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
  width: number;
  isWide: boolean;
}

export const Step = styled(Stepper).withConfig({
  shouldForwardProp: (prop) =>
    !(['isStared', 'isFinished', 'width', 'isWide'] as (keyof StepProps)[]).includes(
      prop as keyof StepProps
    )
})<StepProps>`
  width: 100%;
  padding: 16px 24px 4px;
  transform: ${({ isStared, isFinished, width }) =>
    isStared
      ? `translateX(calc(50% - ${width / 2}px - 16px))`
      : isFinished
        ? `translateX(calc(-1 * (50% - ${width / 2}px - 16px)))`
        : 'none'};

  .MuiStep-root {
    width: ${({ isWide }) => (isWide ? '148px' : '120px')};
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    border: 1px solid ${({ theme }) => theme.color.border.gray05};
    border-radius: 6px;
    background-color: ${({ theme }) => theme.color.background.gray01};
  }
  .MuiStep-root:has(.Mui-disabled),
  .MuiStep-root:has(.Mui-completed) {
    width: ${({ isWide }) => (isWide ? '66px' : '63px')};
  }

  .MuiStepConnector-root {
    flex: 1;
  }
  .MuiStepConnector-root.Mui-completed {
    visibility: hidden;
  }
  .MuiStepConnector-root.Mui-disabled:nth-child(2 of .Mui-disabled) {
    visibility: hidden;
  }
`;

export const Label = styled(StepLabel)`
  &.MuiStepLabel-root {
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
  &.MuiStepLabel-root:has(.Mui-completed),
  &.MuiStepLabel-root:has(.Mui-disabled) {
    gap: unset;
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
  .MuiStepLabel-iconContainer.Mui-disabled,
  .MuiStepLabel-iconContainer.Mui-completed {
    width: 20px;
    height: 20px;
    svg {
      width: 20px;
      height: 20px;
    }
  }

  .MuiStepLabel-iconContainer.Mui-completed {
    transform: rotate(90deg);
    padding: 0;
  }
  .MuiStepLabel-iconContainer.Mui-disabled {
    transform: rotate(270deg);
    padding: 0;
    order: 2;
  }

  .MuiStepLabel-labelContainer {
    span {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      font-family: Pretendard, sans-serif;
      color: ${({ theme }) => theme.color.text.gray04} !important;
    }

    div {
      padding: 0;
      color: ${({ theme }) => theme.color.text.gray04};
    }
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
