import styled, { css } from 'styled-components';
import { ReactElement, useEffect } from 'react';
import HeaderPageLayout from './HeaderPageLayout';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { initTab, selectTab, selectTabSlice } from '../../store/slices/tabSlice';
import Icon from '../Icon';

const TabList = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 20px;
  height: 34px;
  border-bottom: 1px solid #c9cdd2;
`;

const TabItem = styled.div<{ selected: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: NotoSansCJKKR;
  font-size: 13px;
  color: var(--gray-gray-90-01);
  cursor: pointer;

  &:hover {
    background-color: #f7f8f9;
  }

  ${({ selected }) =>
    selected &&
    css`
      border-bottom: solid 2px var(--ai-purple-80-sub);
      color: var(--ai-purple-50-main);
    `}
`;

export interface TabItemType {
  id: string;
  name: string;
  comp: ReactElement;
  icon?: string;
  selectedIcon?: string;
}

export default function TabPage({
  title,
  subTitle,
  tabList
}: {
  title: string;
  subTitle: string;
  tabList: TabItemType[];
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
              {item.icon && (
                <Icon
                  iconSrc={item.id === selectedTab.selectedTabId ? item.selectedIcon : item.icon}
                  cssExt={css`
                    width: 16px;
                    height: 16px;
                    padding-right: 7px;
                  `}
                />
              )}
              {item.name}
            </TabItem>
          ))}
        </TabList>
      }>
      {currentTab && currentTab.comp}
    </HeaderPageLayout>
  );
}
