import styled, { CSSProp, css } from 'styled-components';
import Icon from './Icon';

const Wrapper = styled.div<{ cssExt: any; selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  color: ${({ selected }: { selected: Boolean }) =>
    selected ? 'var(--ai-purple-50-main)' : 'var(--gray-gray-80-02)'};
  font-weight: ${({ selected }: { selected: Boolean }) => selected && 'bold'};
  font-size: 12px;

  &:hover {
    cursor: pointer;
  }

  ${({ cssExt }: any) => cssExt && cssExt};
`;

const IconButton = ({
  cssExt,
  children,
  selected = false,
  onClick,
  icon,
  title
}: {
  cssExt?: CSSProp<any>;
  children?: React.ReactNode;
  selected?: boolean;
  onClick: Function;
  icon?: string;
  title: string;
}) => {
  return (
    <Wrapper
      onClick={() => {
        onClick();
      }}
      selected={selected}
      cssExt={cssExt}>
      <Icon
        iconSrc={icon}
        cssExt={css`
          width: 24px;
          height: 24px;
          padding: 10px 40px 10px 40px;
          background-color: #fff;
          border-radius: 4px;
          border: ${selected ? `solid 1px var(--ai-purple-80-sub)` : ''};
          background-color: ${selected ? `var(--ai-purple-97-list-over)` : ''};
        `}
      />
      {title}
      {children && children}
    </Wrapper>
  );
};

export default IconButton;
