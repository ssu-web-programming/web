import styled from 'styled-components';

// 호진 FIXME: bottom sheet 안에 들어갈때는 제거하기!
const Wrapper = styled.div`
  padding: 0px 16px 0px;
  overflow-y: auto;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  text-align: left;
  color: ${({ theme }) => theme.color.text.gray04};
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
  font-family: 'Pretendard';
  color: ${({ theme }) => theme.color.text.gray04};
  background: ${({ theme }) => theme.color.background.gray10};
`;

export { InputWrapper, SearchInput, Title, Wrapper };
