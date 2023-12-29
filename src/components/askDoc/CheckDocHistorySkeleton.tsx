import Skeleton from '../Skeleton';
import { Wrapper, GuideMessage, Footer } from '../../style/askDoc';
import { alignItemCenter, flex, flexColumn, justiStart } from '../../style/cssCommon';
import styled from 'styled-components';

const List = styled.ul`
  ${flex}
  ${flexColumn}
  ${justiStart}
  
  width: 100%;
  height: 100%;
  padding: 40px 0 0 0;
`;

const Item = styled.li<{ checked: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${justiStart}
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
