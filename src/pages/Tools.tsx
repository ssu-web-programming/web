import { ReactElement } from 'react';
import AIChatTab from '../views/AIChatTab';
import AIWriteTab from '../views/AIWriteTab';
import TabPage from '../components/layout/TabLayout';

interface AiWriteTabItem {
  id: string;
  name: string;
  comp: ReactElement;
}

const TAB_ITEMS: AiWriteTabItem[] = [
  {
    id: 'write',
    name: '작성',
    comp: <AIWriteTab />
  },
  {
    id: 'chat',
    name: '채팅',
    comp: <AIChatTab />
  }
];

export default function Tools() {
  return <TabPage title="AI Tools" subTitle="AI Write" tabList={TAB_ITEMS} />;
}
