import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const FileName = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray03};
  margin-top: 8px;
`;

export { FileName, Wrapper };
