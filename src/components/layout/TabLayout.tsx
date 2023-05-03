import styled, { css } from 'styled-components';
import { ReactElement, useState } from 'react';
import HeaderPageLayout from './HeaderPageLayout';

const TabList = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 20px;
`;

const TabItem = styled.div<{ selected: boolean }>`
  flex: 1;
  ${({ selected }) =>
    selected &&
    css`
      color: blue;
    `}
`;

interface AiWriteTabItem {
  id: string;
  name: string;
  comp: ReactElement;
}

export default function TabPage({
  title,
  subTitle,
  tabList
}: {
  title: string;
  subTitle: string;
  tabList: AiWriteTabItem[];
}) {
  const [selectedTab, setSelectedTab] = useState<any>(tabList[0]);

  return (
    <HeaderPageLayout
      title={title}
      subTitle={subTitle}
      tabComp={
        <TabList>
          {tabList.map((item) => (
            <TabItem
              key={item.id}
              selected={item.id === selectedTab.id}
              onClick={() => setSelectedTab(item)}>
              {item.name}
            </TabItem>
          ))}
        </TabList>
      }>
      {selectedTab.comp}
    </HeaderPageLayout>
  );
}
