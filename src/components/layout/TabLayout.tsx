import styled, { css } from 'styled-components';
import { ReactElement, useEffect } from 'react';
import HeaderPageLayout from './HeaderPageLayout';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { initTab, selectTab, selectTabSlice } from '../../store/slices/tabSlice';

const TabList = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 20px;
`;

const TabItem = styled.div<{ selected: boolean }>`
  flex: 1;
  ${({ selected }) =>
    selected &&
    css`
      color: blue;
    `}
`;

interface AiWriteTabItem {
  id: string;
  name: string;
  comp: ReactElement;
}

export default function TabPage({
  title,
  subTitle,
  tabList
}: {
  title: string;
  subTitle: string;
  tabList: AiWriteTabItem[];
}) {
  const dispatch = useAppDispatch();
  const selectedTab = useAppSelector(selectTabSlice);

  useEffect(() => {
    dispatch(selectTab(tabList[0].id));

    return () => {
      dispatch(initTab());
    };
  }, []);

  const currentTab = tabList.filter((tab) => tab.id === selectedTab.selectedTabId)[0];

  return (
    <HeaderPageLayout
      title={title}
      subTitle={subTitle}
      tabComp={
        <TabList>
          {tabList.map((item) => (
            <TabItem
              key={item.id}
              selected={item.id === selectedTab.selectedTabId}
              onClick={() => dispatch(selectTab(item.id))}>
              {item.name}
            </TabItem>
          ))}
        </TabList>
      }>
      {currentTab && currentTab.comp}
    </HeaderPageLayout>
  );
}
