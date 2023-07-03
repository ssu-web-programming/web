import { useState } from 'react';
import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import icon_chat from '../img/ico_chat.svg';
import icon_chat_purple from '../img/ico_chat_purple.svg';
import icon_creating_text from '../img/ico_creating_text.svg';
import icon_creating_text_purple from '../img/ico_creating_text_purple.svg';
import { useTranslation } from 'react-i18next';
import { AI_WRITE_TAB_TYPE, selectTab, selectTabSlice } from '../store/slices/tabSlice';
import styled, { css } from 'styled-components';
import { flex, flexColumn } from '../style/cssCommon';
import Header from '../components/layout/Header';
import { useAppDispatch, useAppSelector } from '../store/store';
import { activeToast } from '../store/slices/toastSlice';
import Icon from '../components/Icon';
import Tabs from '../components/tabs/Tabs';
import MenuItem from '../components/items/MenuItem';
import TabPanel from '../components/tabs/TabPanel';
import {
  ChatOptions,
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  DEFAULT_WRITE_OPTION_LENGTH_VALUE,
  WriteOptions
} from '../components/FuncRecBox';
import TestDocInsert from '../__test__/TestDocInsert';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

interface TabListProps {
  id: AI_WRITE_TAB_TYPE;
  name: string;
  icon?: string;
  selectedIcon?: string;
}

const TAB_LIST: TabListProps[] = [
  {
    id: 'write',
    name: `Write`,
    icon: icon_creating_text,
    selectedIcon: icon_creating_text_purple
  },
  {
    id: 'chat',
    name: `Chating`,
    icon: icon_chat,
    selectedIcon: icon_chat_purple
  },
  { id: 'test', name: `test`, icon: icon_chat, selectedIcon: icon_chat_purple }
];

const initWriteOptions: WriteOptions = {
  input: '',
  form: DEFAULT_WRITE_OPTION_FORM_VALUE,
  length: DEFAULT_WRITE_OPTION_LENGTH_VALUE
};

const initChatOptions: ChatOptions = {
  input: ''
};

export default function Tools() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { creating, selectedTabId } = useAppSelector(selectTabSlice);
  const currentTab = TAB_LIST.find((tab) => tab.id === selectedTabId);

  const [writeOptions, setWriteOptions] = useState<WriteOptions>(initWriteOptions);
  const [chatOptions, setChatOptions] = useState<ChatOptions>(initChatOptions);

  const onChangeTab = (id: string) => {
    if (creating === 'none') {
      dispatch(selectTab(id as AI_WRITE_TAB_TYPE));
    } else {
      dispatch(
        activeToast({
          type: 'error',
          msg: t(`ToastMsg.TabLoadedAndWait`, { tab: currentTab?.name })
        })
      );
    }
  };

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle={'AI Write'}></Header>
      <Tabs selected={selectedTabId} onChange={onChangeTab}>
        {TAB_LIST.map((tab) => (
          <MenuItem key={tab.id} id={tab.id} value={tab.name}>
            {tab.icon && (
              <Icon iconSrc={tab.id === selectedTabId ? tab.selectedIcon : tab.icon} size="sm" />
            )}
            <div>{t(`${tab.name}`)}</div>
          </MenuItem>
        ))}
      </Tabs>
      <Body>
        <TabPanel selected={selectedTabId}>
          {TAB_LIST.map((tab) => (
            <MenuItem key={tab.id} id={tab.id} value={tab.name}>
              {tab.id === 'write' && (
                <AIWriteTab options={writeOptions} setOptions={setWriteOptions} />
              )}
              {tab.id === 'chat' && <AIChatTab options={chatOptions} setOptions={setChatOptions} />}
              {tab.id === 'test' && <TestDocInsert />}
            </MenuItem>
          ))}
        </TabPanel>
      </Body>
    </Wrapper>
  );
}
