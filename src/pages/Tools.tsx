import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import AITest from '../views/AITest';
import TabLayout, { TabItemType } from '../components/layout/TabLayout';
import icon_chat from '../img/ico_chat.svg';
import icon_creating_text from '../img/ico_creating_text.svg';

export const TAB_ITEM_VAL = {
  WRITE: 'write',
  CHAT: 'chat'
};

const TAB_LIST: TabItemType[] = [
  {
    id: TAB_ITEM_VAL.WRITE,
    name: '작성',
    comp: <AIWriteTab />,
    icon: icon_creating_text
  },
  {
    id: TAB_ITEM_VAL.CHAT,
    name: '채팅',
    comp: <AIChatTab />,
    icon: icon_chat
  },
  {
    id: 'test',
    name: '테스트',
    comp: <AITest />
  }
];

export default function Tools() {
  return <TabLayout title="AI 도구" subTitle="AI Write" tabList={TAB_LIST} />;
}
