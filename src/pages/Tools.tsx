import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import TabLayout, { TabItemType } from '../components/layout/TabLayout';
import icon_chat from '../img/ico_chat.svg';
import icon_chat_purple from '../img/ico_chat_purple.svg';
import icon_creating_text from '../img/ico_creating_text.svg';
import icon_creating_text_purple from '../img/ico_creating_text_purple.svg';
import { useTranslation } from 'react-i18next';
import { TAB_ITEM_VAL } from '../store/slices/tabSlice';

export default function Tools() {
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
    }
  ];

  return <TabLayout title={t('AITools')} subTitle={'AI Write'} tabList={TAB_LIST} />;
}
