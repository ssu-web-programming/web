import styled from 'styled-components';

// 호진 FIXME: bottom sheet 안에 들어갈때는 제거하기!
const Wrapper = styled.div`
  background: #fff;
  height: 100vh;
`;
const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  text-align: left;
`;

const InputWrapper = styled.div`
  position: relative;

  & > svg {
    position: absolute;
    top: 20px;
    left: 12px;
  }
`;

const SearchInput = styled.input`
  padding: 12px 8px 12px 40px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 8px;
  width: 100%;
  border-radius: 8px;
  background: #f7f8f9;
  font-family: 'Pretendard';
  color: #9ea4aa;
`;

export { InputWrapper, SearchInput, Title, Wrapper };
