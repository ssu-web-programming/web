import styled, { css } from 'styled-components';
import Wrapper from '../Wrapper';
import { ReactElement, useState } from 'react';
import AIChatTab from '../../views/AIChatTab';
import AIWriteTab from '../../views/AIWriteTab';

const Contents = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px 10px 20px 10px;
  height: 50px;
  display: flex;
  justify-content: space-between;
`;

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

const Body = styled.div`
  flex: 1;
  overflow: hidden;
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
    <Wrapper>
      <Contents>
        <Header>
          <div>
            {title} | {subTitle}
          </div>
          <div>Close</div>
        </Header>
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
        <Body>{selectedTab.comp}</Body>
      </Contents>
    </Wrapper>
  );
}
