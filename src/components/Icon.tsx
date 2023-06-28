import styled, { CSSProp, css } from 'styled-components';

const IconImg = styled.img<{ size: any; cssExt: any }>`
  ${(props) => props.size}
  ${({ cssExt }: any) => cssExt && cssExt}
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

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps {
  size?: IconSize | number;
  iconSrc: any;
  cssExt?: CSSProp<any>;
  onClick?: Function;
  imgCssExt?: CSSProp<any>;
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
