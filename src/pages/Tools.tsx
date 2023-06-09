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
import {
  alignItemCenter,
  flexColumn,
  flexGrow,
  flexShrink,
  justiCenter,
  justiStart
} from '../style/cssCommon';
import Header from '../components/layout/Header';
import { useAppDispatch, useAppSelector } from '../store/store';
import { activeToast } from '../store/slices/toastSlice';
import Icon from '../components/Icon';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const TabList = styled.div`
  ${justiStart}

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

interface TabListProps {
  id: AI_WRITE_TAB_TYPE;
  name: string;
  comp: ReactElement;
  icon?: string;
  selectedIcon?: string;
}

export default function Tools() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { creating, selectedTabId } = useAppSelector(selectTabSlice);

  const TAB_LIST: TabListProps[] = [
    {
      id: 'write',
      name: t(`Write`),
      comp: <AIWriteTab />,
      icon: icon_creating_text,
      selectedIcon: icon_creating_text_purple
    },
    {
      id: 'chat',
      name: t(`Chating`),
      comp: <AIChatTab />,
      icon: icon_chat,
      selectedIcon: icon_chat_purple
    }
  ];

  const currentTab = TAB_LIST.find((tab) => tab.id === selectedTabId);

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle={'AI Write'}></Header>
      <TabList>
        {TAB_LIST.map((item) => (
          <TabItem
            key={item.id}
            selected={item.id === selectedTabId}
            onClick={() => {
              if (creating === 'none') dispatch(selectTab(item.id));
              else {
                dispatch(
                  activeToast({
                    active: true,
                    msg: t(`ToastMsg.TabLoadedAndWait`, { tab: currentTab?.name }),
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
      <Body>{currentTab?.comp}</Body>
    </Wrapper>
  );
}
