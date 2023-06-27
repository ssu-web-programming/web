import React from 'react';
import styled, { CSSProp, css } from 'styled-components';
import Icon from './Icon';
import icon_credit from '../img/ico_credit.svg';
import { RowBox } from '../views/AIChatTab';
import { alignItemCenter, flex, flexGrow, flexShrink, justiCenter } from '../style/cssCommon';

// const DEFAULT_WIDTH = 200;
// const DEFAULT_HEIGHT = 60;

const Body = styled.button<{ width?: number; height?: number; selected: boolean; cssExt: any }>`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  ${flexGrow}
  ${flexShrink}
  color: white;

  width: fit-content;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px var(--gray-gray-50) inset;
  background-color: #fff;
  color: black;
  font-size: 13px;
  color: var(--gray-gray-90-01);
  padding: 6px;

  flex-basis: fit-content;

  ${({ width, height, selected }) => css`
    width: ${width} ? ${width}px : fit-content;
    height: ${height} ? ${height}px: fit-content;
    box-shadow: ${selected && ' 0 0 0 1px var(--ai-purple-80-sub) inset'};
    background-color: ${selected ? `var(--ai-purple-97-list-over)` : ''};
    color: ${selected ? `var(--ai-purple-50-main)` : ''};
    font-weight: ${selected ? `bold` : ''};
  `}

  &:hover {
    cursor: pointer;
  }

  ${({ cssExt }) => cssExt && cssExt}
`;

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  width?: number;
  height?: number;
  cssExt?: CSSProp<any>;
  children?: React.ReactNode;
  icon?: string;
  isCredit?: boolean;
  disable?: boolean;
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const {
    onClick,
    selected,
    width,
    height,
    children,
    cssExt,
    icon,
    isCredit = false,
    disable = false
  } = props;
  return (
    <Body
      disabled={disable}
      cssExt={css`
        position: relative;
        opacity: ${disable ? 0.3 : 1};
        pointer-events: ${disable && 'none'};
        ${cssExt}
      `}
      width={width}
      height={height}
      selected={selected || false}
      onClick={onClick}>
      <RowBox
        cssExt={css`
          ${justiCenter}
          ${flexGrow}
        `}>
        {icon && <Icon iconSrc={icon} size="sm" />}
        {children}
      </RowBox>
      {isCredit && (
        <Icon
          cssExt={css`
            position: absolute;
            right: 6px;
            flex: none;
          `}
          size="sm"
          iconSrc={icon_credit}
        />
      )}
    </Body>
  );
}
