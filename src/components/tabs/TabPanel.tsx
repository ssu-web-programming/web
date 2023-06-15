import styled from 'styled-components';
import { PropsWithChildren, ReactElement } from 'react';
import { MenuItemProps } from '../items/MenuItem';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface TabPanelProps {
  selected: string;

  children?: ReactElement<MenuItemProps>[];
}

export default function TabPanel(props: PropsWithChildren<TabPanelProps>) {
  const { selected, children } = props;
  const found = children?.find((panel) => panel.props.id === selected);

  if (!found) return null;

  return <Wrapper>{found.props.children}</Wrapper>;
}
