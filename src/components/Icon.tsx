import styled, { CSSProp, css } from 'styled-components';

const IconWrapper = styled.div<{ cssExt: any }>`
  display: flex;
  justify-content: center;
  width: fit-content;
  ${({ cssExt }: any) => cssExt && cssExt}
`;

const IconImg = styled.img``;

interface IconProps {
  iconSrc: any;
  cssExt?: CSSProp<any>;
  onClick?: Function;
}

const Icon = ({ iconSrc, cssExt, onClick }: IconProps) => {
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
      <IconImg src={iconSrc} />
    </IconWrapper>
  );
};

export default Icon;
