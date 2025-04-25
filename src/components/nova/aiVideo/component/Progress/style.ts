import { LinearProgress } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background.selected};
`;

export const PercentGuide = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 4px;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.main};
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
