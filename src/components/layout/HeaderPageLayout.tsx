import styled from 'styled-components';
import Wrapper from '../Wrapper';

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

const Body = styled.div`
  flex: 1;
  overflow: hidden;
`;

export default function HeaderPageLayout({
  title,
  subTitle,
  children,
  tabComp
}: {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  tabComp?: React.ReactNode;
}) {
  return (
    <Wrapper>
      <Contents>
        <Header>
          <div>
            {title} | {subTitle}
          </div>
          <div>Close</div>
        </Header>
        {tabComp && tabComp}
        <Body>{children}</Body>
      </Contents>
    </Wrapper>
  );
}
