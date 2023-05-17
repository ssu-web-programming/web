import styled, { CSSProp, css } from 'styled-components';
import Icon from './Icon';
import { alignItemCenter, flexColumn } from '../style/cssCommon';

const Wrapper = styled.div<{ cssExt: any; selected: boolean }>`
  ${flexColumn}
  ${alignItemCenter}
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

interface IconButtonProps {
  cssExt?: CSSProp<any>;
  children?: React.ReactNode;
  selected?: boolean;
  onClick: Function;
  icon?: string;
  title: string;
  iconCssExt?: CSSProp<any>;
}

const IconButton = ({
  cssExt,
  children,
  selected = false,
  onClick,
  icon,
  title,
  iconCssExt
}: IconButtonProps) => {
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
          ${iconCssExt}
        `}
      />
      {title}
      {children && children}
    </Wrapper>
  );
};

export default IconButton;
