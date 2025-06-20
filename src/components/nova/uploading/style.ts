import styled from 'styled-components';

export const Dim = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => theme.color.background.dimBg02};
  z-index: 20;
`;

export const UploadWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed ${({ theme }) => theme.color.border.purple03};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background.mainBg};
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg path {
    width: 48px;
    height: 48px;
    fill: ${({ theme }) => theme.color.text.main};
  }
  svg circle {
    stroke: ${({ theme }) => theme.color.text.main};
  }
`;

export const Text = styled.span`
  width: 100%;
  text-align: center;
  white-space: break-spaces;
  color: ${({ theme }) => theme.color.text.main};

  &.title {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
  }

  &.desc {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
`;
