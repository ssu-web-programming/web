import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #e8ebed;

  & > p {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
`;

const TextArea = styled.textarea`
  height: 218px;
  padding: 12px 16px;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
`;

export { Header, IconWrapper, TextArea, Wrapper };
