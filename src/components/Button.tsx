import React from 'react';
import styled, { CSSProp, css } from 'styled-components';
import Icon from './Icon';
import icon_credit from '../img/ico_credit.svg';

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
    width: ${width} && ${width}px;
    height: ${height} && ${height}px;
    border: ${selected ? `solid 1px var(--ai-purple-80-sub)` : ''};
    background-color: ${selected ? `var(--ai-purple-97-list-over)` : ''};
    color: var(--ai-purple-50-main);
  `}

  ${({ cssExt }) => cssExt && cssExt}
`;

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  width?: number;
  height?: number;
  cssExt?: CSSProp<any>;
  isCredit?: boolean;
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const { onClick, selected, width, height, children, cssExt, isCredit } = props;
  return (
    <Body
      cssExt={cssExt && cssExt}
      width={width}
      height={height}
      selected={selected || false}
      onClick={onClick}>
      {children}
      {isCredit && (
        <Icon
          iconSrc={icon_credit}
          cssExt={css`
            width: 16px;
            height: 16px;
          `}
        />
      )}
    </Body>
  );
}
