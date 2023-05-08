import React from 'react';
import styled, { CSSProp, css } from 'styled-components';
import Icon from './Icon';
import icon_credit from '../img/ico_credit.svg';
import { RowBox } from '../views/AIChatTab';

// const DEFAULT_WIDTH = 200;
// const DEFAULT_HEIGHT = 60;

const Body = styled.button<{ width?: number; height?: number; selected: boolean; cssExt: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  width: fit-content;
  border-radius: 4px;
  border: solid 1px var(--gray-gray-50);
  background-color: #fff;
  color: black;
  font-size: 13px;
  color: var(--gray-gray-90-01);
  padding: 6px;
  flex: 1 1 fit-content;
  margin: 3px;

  ${({ width, height, selected }) => css`
    width: ${width} ? ${width}px : fit-content;
    height: ${height} ? ${height}px: fit-content;
    border: ${selected ? `solid 1px var(--ai-purple-80-sub)` : ''};
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
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const { onClick, selected, width, height, children, cssExt, icon, isCredit = false } = props;
  return (
    <Body
      cssExt={css`
        position: relative;
        ${cssExt}
      `}
      width={width}
      height={height}
      selected={selected || false}
      onClick={onClick}>
      <RowBox
        cssExt={css`
          display: flex;
          justify-content: center;
          flex-grow: 1;
        `}>
        {icon && (
          <Icon
            iconSrc={icon}
            cssExt={css`
              margin-right: 6px;
            `}
          />
        )}
        {children}
      </RowBox>
      {isCredit && (
        <Icon
          cssExt={css`
            position: absolute;
            right: 6px;
            flex: none;
          `}
          iconSrc={icon_credit}
        />
      )}
    </Body>
  );
}
