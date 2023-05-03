import { ReactElement } from 'react';
import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import AITest from '../views/AITest';
import TabLayout from '../components/layout/TabLayout';

interface AiWriteTabItem {
  id: string;
  name: string;
  comp: ReactElement;
}

export const TAB_ITEM_VAL = {
  WRITE: 'write',
  CHAT: 'chat'
};

const TAB_LIST: AiWriteTabItem[] = [
  {
    id: TAB_ITEM_VAL.WRITE,
    name: '작성',
    comp: <AIWriteTab />
  },
  {
    id: TAB_ITEM_VAL.CHAT,
    name: '채팅',
    comp: <AIChatTab />
  },
  {
    id: 'test',
    name: '테스트',
    comp: <AITest />
  }
];

export default function Tools() {
  return <TabLayout title="AI Tools" subTitle="AI Write" tabList={TAB_LIST} />;
}
