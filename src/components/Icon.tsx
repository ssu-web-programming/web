import styled, { CSSProp, css } from 'styled-components';
import { justiCenter } from '../style/cssCommon';

const IconWrapper = styled.div<{ cssExt: any }>`
  ${justiCenter}

  width: fit-content;
  ${({ cssExt }: any) => cssExt && cssExt}
`;

const IconImg = styled.img<{ cssExt: any }>`
  ${({ cssExt }: any) => cssExt && cssExt}
`;

interface IconProps {
  iconSrc: any;
  cssExt?: CSSProp<any>;
  onClick?: Function;
  imgCssExt?: CSSProp<any>;
}

const Icon = ({ iconSrc, cssExt, imgCssExt, onClick }: IconProps) => {
  return (
    <IconWrapper
      onClick={(e: React.MouseEvent) => {
        onClick && onClick(e);
      }}
      cssExt={css`
        &:hover {
          ${onClick && 'cursor: pointer'}
        }

        ${cssExt && cssExt}
      `}>
      <IconImg
        src={iconSrc}
        cssExt={css`
          &:hover {
            ${onClick && 'cursor: pointer'}
          }

          ${imgCssExt && imgCssExt}
        `}
      />
    </IconWrapper>
  );
};

export default Icon;
