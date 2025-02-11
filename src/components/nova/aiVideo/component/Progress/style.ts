import { LinearProgress } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
  background-color: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.7)'};
  border-radius: 12px;
`;

export const PercentGuide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--white);
    text-align: center;
  }
`;

export const ProgressBar = styled(LinearProgress)`
  &.MuiLinearProgress-root {
    height: 24px;
    border-radius: 99px;
    background-color: ${({ theme }) => theme.color.background.gray05};
  }

  .MuiLinearProgress-bar {
    background-color: ${({ theme }) => theme.color.background.purple01};
  }
`;
