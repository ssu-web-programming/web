import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import { flex } from '../style/cssCommon';

const IconImg = styled.img<{ size: FlattenSimpleInterpolation }>`
  ${flex}
  ${(props) => props.size}
`;

export const SIZES = {
  sm: css`
    width: 16px;
    height: 16px;
  `,
  md: css`
    width: 24px;
    height: 24px;
  `,
  lg: css`
    width: 32px;
    height: 32px;
  `
};

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  size?: IconSize | number;
  iconSrc: string;
}

const Icon = ({ size = 'md', iconSrc }: IconProps) => {
  const sizeStyle =
    typeof size === 'string'
      ? SIZES[size]
      : css`
          width: ${size}px;
          height: ${size}px;
        `;

  return <IconImg src={iconSrc} size={sizeStyle} />;
};

export default Icon;
