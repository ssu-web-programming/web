import styled, { css } from 'styled-components';
import { ReactElement, useEffect } from 'react';
import HeaderPageLayout from './HeaderPageLayout';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { selectTab, selectTabSlice } from '../../store/slices/tabSlice';
import Icon from '../Icon';
import { activeToast } from '../../store/slices/toastSlice';
import {
  justiCenter,
  flexGrow,
  justiStart,
  alignItemCenter,
  flexShrink
} from '../../style/cssCommon';
import { useTranslation } from 'react-i18next';

const TabList = styled.div`
  ${justiStart}

  height: 20px;
  height: 34px;
  border-bottom: 1px solid #c9cdd2;
`;

const TabItem = styled.div<{ selected: boolean }>`
  /* flex: 1; */
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
  const { isLoading, selectedTabId } = useAppSelector(selectTabSlice);
  const { t } = useTranslation();

  useEffect(() => {
    if (!selectedTabId) dispatch(selectTab(tabList[0].id));
  }, []);

  const currentTab = tabList.filter((tab) => tab.id === selectedTabId)[0];

  return (
    <HeaderPageLayout
      title={title}
      subTitle={subTitle}
      tabComp={
        <TabList>
          {tabList.map((item) => (
            <TabItem
              key={item.id}
              selected={item.id === selectedTabId}
              onClick={() => {
                if (!isLoading) dispatch(selectTab(item.id));
                else {
                  dispatch(
                    activeToast({
                      active: true,
                      msg: t(`ToastMsg.TabLoadedAndWait`, { tab: currentTab.name }),
                      isError: true
                    })
                  );
                }
              }}>
              {item.icon && (
                <Icon
                  iconSrc={item.id === selectedTabId ? item.selectedIcon : item.icon}
                  cssExt={css`
                    width: 16px;
                    height: 16px;
                    padding-right: 7px;
                  `}
                />
              )}
              <div>{item.name}</div>
            </TabItem>
          ))}
        </TabList>
      }>
      {currentTab && currentTab.comp}
    </HeaderPageLayout>
  );
}
