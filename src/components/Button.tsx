import React from 'react';
import styled, { css } from 'styled-components';

// const DEFAULT_WIDTH = 200;
// const DEFAULT_HEIGHT = 60;

const Body = styled.button<{ width?: number; height?: number; selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  ${({ width, height, selected }) => css`
    width: ${width} && ${width}px;
    height: ${height} && ${height}px;
    background-color: ${selected ? 'purple' : 'gray'};
  `}
`;

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  width?: number;
  height?: number;
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const { onClick, selected, width, height, children } = props;
  return (
    <Body width={width} height={height} selected={selected || false} onClick={onClick}>
      {children}
    </Body>
  );
}
