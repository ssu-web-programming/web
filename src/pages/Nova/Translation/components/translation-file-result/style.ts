import styled from 'styled-components';

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  margin-top: 8px;
  color: ${({ theme }) => theme.color.text.gray05};
`;

const FileItemWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.color.background.gray02};
  background: ${({ theme }) => theme.color.background.gray01};
  border-radius: 16px;
  padding: 32px 16px;
  margin-top: 40px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const ButtonGroup = styled.div`
  margin-top: auto;
`;

export { ButtonGroup, Container, ContentWrapper, FileItemWrapper, SubTitle, Title };
