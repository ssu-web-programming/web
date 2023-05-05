import styled, { CSSProp } from 'styled-components';

const Wrapper = styled.div<{ cssExt: any; selected: boolean }>`
  display: flex;
  width: fit-content;
  height: fit-content;
  flex-direction: column;

  ${({ cssExt }: any) => cssExt && cssExt}
`;

const IconButton = ({
  title,
  cssExt,
  children,
  selected = false,
  onClick
}: {
  title: string;
  cssExt?: CSSProp<any>;
  children?: React.ReactNode;
  selected?: boolean;
  onClick: Function;
}) => {
  return (
    <Wrapper
      onClick={() => {
        onClick();
      }}
      cssExt={cssExt}
      selected={selected}>
      {children && children}
      {title}
    </Wrapper>
  );
};

export default IconButton;
