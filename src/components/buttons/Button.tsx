import React from 'react';
import styled, {
  css,
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemedStyledProps
} from 'styled-components';

const Body = styled.button<{
  w: FlattenSimpleInterpolation;
  h?: FlattenSimpleInterpolation;
  variant: FlattenInterpolation<
    ThemedStyledProps<{ selected: boolean }, FlattenSimpleInterpolation>
  >;
  border: FlattenInterpolation<
    ThemedStyledProps<{ selected: boolean }, FlattenSimpleInterpolation>
  >;
  selected: boolean;
  disabled: boolean;
  cssExt?: FlattenSimpleInterpolation;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;

  border-radius: 4px;
  padding: 6px;

  font-size: 13px;
  line-height: 1.54;

  &:hover {
    cursor: pointer;
  }

  ${(props) => props.w}
  ${(props) => props.h}

  ${(props) => props.variant}
  ${(props) => props.border}

  ${({ selected }) =>
    selected &&
    css`
      background-color: var(--ai-purple-97-list-over);
      color: var(--ai-purple-50-main);
      font-weight: bold;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}

  ${(props) => props.cssExt || ''};
`;

export type ButtonSize = 'sm' | 'md' | 'lg' | 'full' | 'fit';
const SIZES = {
  sm: css`
    width: 200px;
  `,
  md: css`
    width: 250px;
  `,
  lg: css`
    width: 300px;
  `,
  full: css`
    width: 100%;
  `,
  fit: css`
    width: fit-content;
  `
};

export type HeightButtonSize = 'full' | 'fit';
const HEIGHT_SIZES = {
  full: css`
    height: 100%;
  `,
  fit: css`
    height: fit-content;
  `
};

export type ButtonVariant =
  | 'none'
  | 'white'
  | 'purpleGradient'
  | 'gray'
  | 'darkGray'
  | 'transparent'
  | 'purple'
  | 'grayToPurple';

const VARIANTS = {
  none: css`
    background-color: transparent;
    color: unset;
  `,
  white: css<{ selected: boolean }>`
    background-color: ${({ selected }) => (selected ? `white` : `white`)};
    color: var(--gray-gray-90-01);
  `,
  purple: css<{ selected: boolean }>`
    background-color: ${({ selected }) =>
      selected ? `var(--ai-purple-50-main)` : `var(--ai-purple-50-main)`};
    color: white;
  `,
  purpleGradient: css<{ selected: boolean }>`
    background-image: ${({ selected }) =>
      selected ? `white` : `linear-gradient(to left, #a86cea, var(--ai-purple-50-main))`};
    color: white;
  `,
  gray: css<{ selected: boolean }>`
    background-color: ${({ selected, theme }) =>
      selected ? `var(--ai-purple-97-list-over)` : theme.color.subBgGray02};
    color: ${({ theme }) => theme.color.text.subGray04};
  `,
  grayToPurple: css<{ selected: boolean }>`
    background-color: ${({ selected, theme }) =>
      selected ? `var(--ai-purple-50-main) !important` : theme.color.subBgGray02};
    color: ${({ theme, selected }) => (selected ? 'white !important' : theme.color.text.subGray01)};
  `,
  darkGray: css<{ selected: boolean }>`
    background-color: ${({ selected }) => (selected ? `var(--ai-purple-97-list-over)` : `#D2D9E0`)};
    color: var(--gray-gray-90-01);
  `,
  transparent: css<{ selected: boolean }>`
    background-color: ${({ selected }) => (selected ? `transparent` : `transparent`)};
    color: var(--gray-gray-90-01);
  `
};

export type ButtonBorderType = 'none' | 'gray';
const BORDER_TYPES = {
  none: css<{ selected: boolean }>`
    box-shadow: ${({ selected }) =>
      selected ? `0 0 0 1px var(--ai-purple-90) inset` : `0 0 0 1px transparent inset`};
  `,
  gray: css<{ selected: boolean }>`
    box-shadow: ${({ selected }) =>
      selected ? `0 0 0 1px var(--ai-purple-90) inset` : `0 0 0 1px var(--gray-gray-50) inset`};
  `
};

const DEFAULT_BUTTON_HEIGHT = 28;

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  width?: ButtonSize | number;
  height?: number | HeightButtonSize;
  variant?: ButtonVariant;
  borderType?: ButtonBorderType;
  cssExt?: FlattenSimpleInterpolation;
  disable?: boolean;
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const {
    onClick,
    selected = false,
    width = 'md',
    height = DEFAULT_BUTTON_HEIGHT,
    variant = 'white',
    borderType = 'none',
    children,
    cssExt,
    disable = false
  } = props;

  const w =
    typeof width === 'string'
      ? SIZES[width]
      : css`
          width: ${width}px;
        `;

  const h =
    typeof height === 'string'
      ? HEIGHT_SIZES[height]
      : css`
          height: ${height}px;
        `;

  const variantValue = VARIANTS[variant];

  const border = BORDER_TYPES[borderType];

  return (
    <Body
      disabled={disable}
      cssExt={cssExt}
      w={w}
      h={h}
      selected={selected}
      variant={variantValue}
      border={border}
      onClick={onClick}>
      {children}
    </Body>
  );
}
