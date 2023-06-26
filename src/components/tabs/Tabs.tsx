import { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import {
  alignItemCenter,
  flex,
  flexGrow,
  flexShrink,
  justiCenter,
  justiStart
} from '../../style/cssCommon';
import { MenuItemProps } from '../items/MenuItem';

const Wrapper = styled.div`
  ${flex}
  ${justiStart}

  height: 34px;
  border-bottom: 1px solid #c9cdd2;
`;

const TabItem = styled.div<{ selected: boolean }>`
  ${flex}
  ${flexGrow}
  ${flexShrink}
  ${alignItemCenter}
  ${justiCenter}

  font-size: 13px;
  color: var(--gray-gray-90-01);
  cursor: pointer;

  &:hover {
    background-color: #f7f8f9;
  }
  box-sizing: border-box;
  ${({ selected }) =>
    selected &&
    css`
      border-bottom: solid 2px var(--ai-purple-80-sub);
      color: var(--ai-purple-50-main);
      font-weight: bold;
    `}
`;

interface TabProps {
  selected: string;
  onChange: (id: string) => void;

  children?: ReactElement<MenuItemProps>[];
}

export default function Tabs(props: TabProps) {
  const { selected, onChange, children } = props;

  return (
    <Wrapper>
      {children
        ? children.map((tab) => {
            const { id, children } = tab.props;
            return (
              <TabItem
                key={id}
                selected={selected === id}
                onClick={() => {
                  if (onChange) onChange(id);
                }}>
                {children}
              </TabItem>
            );
          })
        : null}
    </Wrapper>
  );
}
