import styled, { FlattenSimpleInterpolation, css } from 'styled-components';

const IconImg = styled.img<{ size: any; cssExt: FlattenSimpleInterpolation }>`
  ${(props) => props.size}
  ${({ cssExt }) => cssExt && cssExt}
`;

const SIZES = {
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

interface IconProps {
  size?: IconSize | number;
  iconSrc: any;
  cssExt?: FlattenSimpleInterpolation;
  onClick?: (e: React.MouseEvent) => void;
  imgCssExt?: FlattenSimpleInterpolation;
}

const Icon = ({ size = 'md', iconSrc, cssExt, onClick }: IconProps) => {
  const sizeStyle =
    typeof size === 'string'
      ? SIZES[size]
      : css`
          width: ${size}px;
          height: ${size}px;
        `;

  return (
    <IconImg
      src={iconSrc}
      onClick={(e: React.MouseEvent) => {
        onClick && onClick(e);
      }}
      size={sizeStyle}
      cssExt={css`
        ${cssExt && cssExt}
        &:hover {
          ${onClick && 'cursor: pointer'}
        }
      `}
    />
  );
};

export default Icon;
