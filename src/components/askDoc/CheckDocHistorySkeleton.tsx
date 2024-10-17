import styled from 'styled-components';

import { Footer, GuideMessage, Wrapper } from '../../style/askDoc';
import Skeleton from '../Skeleton';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  width: 100%;
  height: 100%;
  padding: 40px 0 0 0;
`;

const Item = styled.li<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 8px;

  width: 100%;
  padding: 12px 24px;
  margin: 0;
  background-color: ${(props) => (props.checked ? '#ede5fe' : 'none')};
`;

const CheckDocHistorySkeleton = () => {
  return (
    <Wrapper background={false}>
      <GuideMessage>
        <Skeleton width={80} height={32} $wUnit={'%'} />
        <Skeleton width={90} height={21} $wUnit={'%'} />
      </GuideMessage>
      <List>
        {Array.from({ length: 3 }).map((_, idx) => {
          return (
            <Item checked={false} key={`skeleton-${idx}`}>
              <Skeleton width={100} height={48} $wUnit={'%'} />
            </Item>
          );
        })}
      </List>
      <Footer>
        <Skeleton width={100} height={40} $wUnit={'%'} />
      </Footer>
    </Wrapper>
  );
};

export default CheckDocHistorySkeleton;
