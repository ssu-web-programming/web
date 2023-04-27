import styled from 'styled-components';
import { RowBox } from '../../views/AIChatTab';
import Button from '../Button';

const Wrapper = styled.div`
  background-color: lightgray;
  border-radius: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const FucRecBox = () => {
  return (
    <Wrapper>
      <RowBox>
        <Button>이어쓰기</Button>
        <Button>요약하기</Button>
        <Button>번역하기</Button>
        <Button>문체 변경하기</Button>
        <Button>맞춤법/문법 수정하기</Button>
      </RowBox>
      <div> 더 많은 텍스트를 만들어보세요</div>
    </Wrapper>
  );
};

export default FucRecBox;
