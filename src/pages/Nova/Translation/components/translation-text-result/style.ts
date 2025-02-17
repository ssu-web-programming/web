import styled from 'styled-components';

const Title = styled.p`
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

const Wrapper = styled.div`
  margin-top: 12px;
`;

export { Title, Wrapper };
