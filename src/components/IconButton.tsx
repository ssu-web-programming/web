import styled, { css } from 'styled-components';
import Icon from './Icon';
import { alignItemCenter, flex, flexColumn } from '../style/cssCommon';

const IconWrapper = styled.div`
  width: 100%;
  height: 48px;

  margin-bottom: 8px;
  border-radius: 4px;

  box-sizing: border-box;
  padding: 12px 0px;
`;

const Wrapper = styled.div<{ selected: boolean }>`
  ${flex}
  ${flexColumn}
  ${alignItemCenter}

  
  ${({ selected }) =>
    selected
      ? css`
          color: var(--ai-purple-50-main);
          font-weight: bold;
          ${IconWrapper} {
            background-color: var(--ai-purple-97-list-over);
            box-shadow: 0 0 0 1px var(--ai-purple-80-sub) inset;
          }
        `
      : css`
          color: var(--gray-gray-80-02);
          ${IconWrapper} {
            background-color: var(--gray-gray-20);
            box-shadow: 0 0 0 1px transparent inset;
          }
        `}
        
  font-size: 12px;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

interface IconButtonProps {
  selected?: boolean;
  onClick: Function;
  icon?: string;
  title: string;
}

const IconButton = ({ selected = false, onClick, icon, title }: IconButtonProps) => {
  return (
    <Wrapper onClick={() => onClick()} selected={selected}>
      <IconWrapper>
        <Icon iconSrc={icon} size="md" />
      </IconWrapper>
      {title}
    </Wrapper>
  );
};

export default IconButton;
