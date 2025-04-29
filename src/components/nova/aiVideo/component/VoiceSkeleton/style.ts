import styled, { keyframes } from 'styled-components';

export const SkeletonContainer = styled.div`
  width: 100%;
  height: 65px;
  border-radius: 4px;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};
`;

const skeletonPulse = (fromColor: string, toColor: string) => keyframes`
  0%, 100% {
    background-color: ${fromColor};
  }
  50% {
    background-color: ${toColor};
  }
`;
export const Skeleton = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 12px 12px;
  gap: 7px;
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  background-color: ${({ theme }) => theme.color.background.gray01};

  .content1 {
    width: 50%;
    height: 18px;
    animation: ${({ theme }) =>
        skeletonPulse(theme.color.background.gray10, theme.color.background.gray16)}
      2s ease-in-out infinite;
  }

  .content2 {
    width: 100%;
    height: 16px;
    animation: ${({ theme }) =>
        skeletonPulse(theme.color.background.gray10, theme.color.background.gray16)}
      2s ease-in-out infinite;
  }
`;
