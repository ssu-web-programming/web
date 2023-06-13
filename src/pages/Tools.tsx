import { ReactElement } from 'react';
import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import icon_chat from '../img/ico_chat.svg';
import icon_chat_purple from '../img/ico_chat_purple.svg';
import icon_creating_text from '../img/ico_creating_text.svg';
import icon_creating_text_purple from '../img/ico_creating_text_purple.svg';
import { useTranslation } from 'react-i18next';
import { AI_WRITE_TAB_TYPE, selectTab, selectTabSlice } from '../store/slices/tabSlice';
import styled, { css } from 'styled-components';
import { flexColumn } from '../style/cssCommon';
import Header from '../components/layout/Header';
import { useAppDispatch, useAppSelector } from '../store/store';
import { activeToast } from '../store/slices/toastSlice';
import Icon from '../components/Icon';
import Tabs from '../components/tabs/Tabs';
import MenuItem from '../components/items/MenuItem';
import TabPanel from '../components/tabs/TabPanel';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

interface TabListProps {
  id: AI_WRITE_TAB_TYPE;
  name: string;
  comp: ReactElement;
  icon?: string;
  selectedIcon?: string;
}

const TAB_LIST: TabListProps[] = [
  {
    id: 'write',
    name: `Write`,
    comp: <AIWriteTab />,
    icon: icon_creating_text,
    selectedIcon: icon_creating_text_purple
  },
  {
    id: 'chat',
    name: `Chating`,
    comp: <AIChatTab />,
    icon: icon_chat,
    selectedIcon: icon_chat_purple
  }
];

export default function Tools() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { creating, selectedTabId } = useAppSelector(selectTabSlice);
  const currentTab = TAB_LIST.find((tab) => tab.id === selectedTabId);

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle={'AI Write'}></Header>
      <Tabs
        selected={selectedTabId}
        onChange={(id) => {
          if (creating === 'none') {
            dispatch(selectTab(id as AI_WRITE_TAB_TYPE));
          } else {
            dispatch(
              activeToast({
                active: true,
                msg: t(`ToastMsg.TabLoadedAndWait`, { tab: currentTab?.name }),
                isError: true
              })
            );
          }
        }}>
        {TAB_LIST.map((tab) => (
          <MenuItem key={tab.id} id={tab.id} value={tab.name}>
            {tab.icon && (
              <Icon
                iconSrc={tab.id === selectedTabId ? tab.selectedIcon : tab.icon}
                cssExt={css`
                  width: 16px;
                  height: 16px;
                  padding-right: 7px;
                `}
              />
            )}
            <div>{t(`${tab.name}`)}</div>
          </MenuItem>
        ))}
      </Tabs>
      <Body>
        <TabPanel selected={selectedTabId}>
          {TAB_LIST.map((tab) => (
            <MenuItem key={tab.id} id={tab.id} value={tab.name}>
              {tab.comp}
            </MenuItem>
          ))}
        </TabPanel>
      </Body>
    </Wrapper>
  );
}
