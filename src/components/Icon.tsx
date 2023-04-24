import styled, { CSSProp } from 'styled-components';

const IconWrapper = styled.div<{ cssExt: any }>`
  display: flex;
  justify-content: center;
  ${({ cssExt }: any) => cssExt && cssExt}
`;

const IconImg = styled.img``;

interface IconProps {
  iconSrc: any;
  cssExt?: CSSProp<any>;
}

const Icon = ({ iconSrc, cssExt }: IconProps) => {
  return (
    <IconWrapper cssExt={cssExt}>
      <IconImg src={iconSrc} />
    </IconWrapper>
  );
};

export default Icon;
