import styled, { FlattenSimpleInterpolation } from 'styled-components';

import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';

export const Wrap = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  width: 100%;
  height: 52px;
  min-height: 52px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px 16px;
  z-index: 1;
  background-color: ${({ theme }) => theme.color.bg};

  ${(props) => props.cssExt || ''};
`;

export const Tap = styled.div<{ isHighlighted: boolean }>`
  height: 32px;
  display: flex;
  align-items: center;
  padding: 6px 12px 6px 8px;
  border: 1px solid
    ${(props) =>
      props.isHighlighted ? props.theme.color.tab.highlightBorder : props.theme.color.tab.border};
  border-radius: 8px;
  background-color: ${(props) =>
    props.isHighlighted ? props.theme.color.tab.highlightBg : props.theme.color.tab.bg};
  cursor: pointer;
`;

export const Badge = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fb4949;
  border-radius: 4px;

  span {
    font-size: 10px;
    font-weight: bold;
    line-height: 10px;
    color: white;
  }
`;

export const Text = styled.div<{ isHighlighted: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.isHighlighted ? 500 : 400)};
  color: ${(props) =>
    props.isHighlighted ? props.theme.color.tab.highlight : props.theme.color.tab.text};
`;

export const CustomNavButton = styled.button<{ isVisible: boolean }>`
  width: 52px;
  height: 52px;
  top: var(--swiper-navigation-top-offset, 42%);
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }

  :after {
    display: none;
  }
`;

export const StyledIconConvertLight = styled(IconConvertLight)<{ $isHighlighted: boolean }>`
  path {
    fill: ${(props) => (props.$isHighlighted ? '#511bb2' : 'black')};
  }
`;

export const StyledIconConvertDark = styled(IconConvertDark)<{ $isHighlighted: boolean }>`
  path {
    fill: ${(props) => (props.$isHighlighted ? '#c6a9ff' : '#d8d8d8')};
  }
`;
