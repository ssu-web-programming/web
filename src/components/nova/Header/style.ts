import styled, { css } from 'styled-components';

import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import { ReactComponent as CreditLineIcon } from '../../../img/light/ico_credit_line.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import Header from '../../layout/Header';

export const flexCenter = css`
  display: flex;
  align-items: center;
`;

export const StyledHeader = styled(Header)`
  width: 100%;
`;

export const TitleWrapper = styled.div`
  ${flexCenter};
  flex-direction: row;
  gap: 4px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const Logo = styled.img`
  content: url(${({ theme }) => theme.img.logo});
`;

export const ChatMode = styled.div`
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  background: ${({ theme }) => theme.color.background.gray09};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  line-height: 16.5px;
  color: ${({ theme }) => theme.color.text.highlightText};
`;

export const ButtonWrapper = styled.div`
  height: 32px;
  gap: 8px;

  ${flexCenter};
  flex-direction: row;
`;

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

export const StyledIconConvertLight = styled(IconConvertLight)`
  path {
    fill: black;
  }
`;

export const StyledIconConvertDark = styled(IconConvertDark)`
  path {
    fill: var(--gray-gray-25);
  }
`;
