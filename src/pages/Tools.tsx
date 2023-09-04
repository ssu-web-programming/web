import { useState } from 'react';
import AIChatTab, { ChatOptions } from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import { useTranslation } from 'react-i18next';
import { AI_WRITE_TAB_TYPE, selectTab, selectTabSlice } from '../store/slices/tabSlice';
import styled from 'styled-components';
import { flex, flexColumn } from '../style/cssCommon';
import Header from '../components/layout/Header';
import { useAppDispatch, useAppSelector } from '../store/store';
import { activeToast } from '../store/slices/toastSlice';
import Tabs from '../components/tabs/Tabs';
import MenuItem from '../components/items/MenuItem';
import TabPanel from '../components/tabs/TabPanel';
import {
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  DEFAULT_WRITE_OPTION_LENGTH_VALUE,
  DEFAULT_WRITE_OPTION_VERSION_VALUE,
  WriteOptions
} from '../components/chat/RecommendBox/FormRec';

import { ReactComponent as IconChat } from '../img/ico_chat.svg';
import { ReactComponent as IconCreatingText } from '../img/ico_creating_text.svg';

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
  icon?: React.FunctionComponentElement<
    React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>
  >;
}

const TAB_LIST: TabListProps[] = [
  {
    id: 'write',
    name: `Write`,
    icon: <IconCreatingText></IconCreatingText>
  },
  {
    id: 'chat',
    name: `Chatting`,
    icon: <IconChat></IconChat>
  }
];

const initWriteOptions: WriteOptions = {
  input: '',
  version: DEFAULT_WRITE_OPTION_VERSION_VALUE,
  form: DEFAULT_WRITE_OPTION_FORM_VALUE,
  length: DEFAULT_WRITE_OPTION_LENGTH_VALUE
};

const initChatOptions: ChatOptions = {
  input: '',
  version: DEFAULT_WRITE_OPTION_VERSION_VALUE
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
          <MenuItem key={tab.id} id={tab.id} value={tab.name} icon={tab.icon}>
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
            </MenuItem>
          ))}
        </TabPanel>
      </Body>
    </Wrapper>
  );
}
