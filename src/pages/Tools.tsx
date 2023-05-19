import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import AITest from '../views/AITest';
import TabLayout, { TabItemType } from '../components/layout/TabLayout';
import icon_chat from '../img/ico_chat.svg';
import icon_chat_purple from '../img/ico_chat_purple.svg';
import icon_creating_text from '../img/ico_creating_text.svg';
import icon_creating_text_purple from '../img/ico_creating_text_purple.svg';
import { useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import { selectTab } from '../store/slices/tabSlice';
import { useTranslation } from 'react-i18next';

export const TAB_ITEM_VAL = {
  WRITE: 'write',
  CHAT: 'chat'
};

export default function Tools() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const TAB_LIST: TabItemType[] = [
    {
      id: TAB_ITEM_VAL.WRITE,
      name: t(`Write`),
      comp: <AIWriteTab />,
      icon: icon_creating_text,
      selectedIcon: icon_creating_text_purple
    },
    {
      id: TAB_ITEM_VAL.CHAT,
      name: t(`Chating`),
      comp: <AIChatTab />,
      icon: icon_chat,
      selectedIcon: icon_chat_purple
    },
    {
      id: 'test',
      name: t(`Test`),
      comp: <AITest />
    }
  ];

  useEffect(() => {
    dispatch(selectTab(TAB_ITEM_VAL.CHAT));
  }, []);

  return <TabLayout title={t('AITools')} subTitle={'AI Write'} tabList={TAB_LIST} />;
}
