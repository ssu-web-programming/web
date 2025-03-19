import { Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';
import styled from 'styled-components';

import { ReactComponent as CreditLineIcon } from '../../../img/light/ico_credit_line.svg';

export const TooltipContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreditIconWrapper = styled.div``;

export const CreditIcon = styled(CreditLineIcon)<{
  $isInit: boolean;
}>`
  path {
    fill: ${({ $isInit, theme }) =>
      $isInit
        ? theme.mode === 'light'
          ? 'var(--gray-gray-80-02)'
          : 'var(--gray-gray-25)'
        : '#454c5380'};
  }

  circle {
    stroke: ${({ $isInit, theme }) =>
      $isInit
        ? theme.mode === 'light'
          ? 'var(--gray-gray-80-02)'
          : 'var(--gray-gray-25)'
        : '#454c5380'};
  }
`;

export const TooltipWrap = styled.div<{ $isWide: boolean }>`
  width: ${({ $isWide }) => ($isWide ? '240px' : '202px')};
  position: absolute;
  top: 36px;
  right: -16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 #0000001a;
  background-color: ${({ theme }) => (theme.mode === 'light' ? 'white' : 'var(--gray-gray-87)')};
  z-index: 5;
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const List = styled.ul`
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  li::before {
    content: '•';
    font-size: 12px;
    color: ${({ theme }) => theme.color.text.gray04};
  }
`;

export const CustomTabs = styled(Tabs)`
  width: 100%;
  min-height: fit-content !important;

  .MuiTabs-flexContainer {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-x: hidden;
    border-radius: 4px;
  }

  .MuiTab-root {
    min-width: auto;
    min-height: auto;
    padding: 4px 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    font-family: Pretendard, sans-serif;
    text-align: center;
    text-transform: none !important;
    color: ${({ theme }) => theme.color.text.gray04} !important;
    background-color: ${({ theme }) => theme.color.background.bg};
  }

  .Mui-selected {
    color: ${({ theme }) => theme.color.text.highlight03} !important;
    background-color: ${({ theme }) => theme.color.background.selected};
    border-radius: 4px;
    &::after {
      display: none;
    }
  }

  .MuiTabs-indicator {
    display: none;
  }
`;

export const CustomTab = styled(Tab)<{ $isDivider: boolean }>`
  position: relative;
  ${({ $isDivider, theme }) =>
    $isDivider &&
    `
    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 33%;
      height: 40%;
      width: 1px;
      background-color: ${theme.color.border.gray02};
    }
  `}
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6.5px;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray04};
  }
`;

export const CreditWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
