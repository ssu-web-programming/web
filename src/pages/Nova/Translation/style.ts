import styled from 'styled-components';

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  display: flex;
`;

const TextAreaWrapper = styled.div`
  height: 425px;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #c9cdd2;
  background: #fff;
`;

const TextAreaHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 48px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 322px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #26282b;
  padding: 12px 16px;
  border-top: 1px solid #e8ebed;
  border-bottom: 1px solid #e8ebed;
`;

const TextAreaBottom = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;

  & > span {
    color: #9ea4aa;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
  }
`;

export { TextArea, TextAreaBottom, TextAreaHeader, TextAreaWrapper, ToggleWrapper };
