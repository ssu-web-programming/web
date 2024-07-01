import styled from 'styled-components';
import InputBar from 'components/nova/InputBar';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export default function Nova() {
  return (
    <Wrapper>
      <Header>Hello Nova</Header>
      <Body></Body>
      <InputBar></InputBar>
    </Wrapper>
  );
}
