import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  padding: 24px 16px 0px;
`;

const Title = styled.div<{ lang: string }>`
  display: flex;
  flex-direction: ${(props) => (props.lang === 'en' ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  gap: 4px;

  span {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: ${({ theme }) => theme.color.text.gray04};
    text-align: center;
    white-space: break-spaces;
  }
`;

const Description = styled.p`
  color: #454c53;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 500;
  line-height: 24px;
  margin-top: 8px;
`;

const TranscriptWrapper = styled.div`
  height: 100%;
  padding: 0px 16px;
`;

const TranscriptContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  height: 314px;
  margin: 0px 16px;
`;

const NewTranscript = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border-radius: 0.5rem;
  border: none;
  width: 100%;
  justify-content: space-between;
  color: #374151;
  font-size: 0.875rem;

  & > span:nth-child(1) {
    color: #454c53;
    font-size: 16px;
    font-weight: 600;
  }

  & > span:nth-child(2) {
    color: #9ea4aa;
    font-size: 14px;
    font-weight: 400;
  }
`;

const TranscriptItem = styled.div<{ color: string }>`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 16px;
`;

const TranscriptIcon = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
`;

const TranscriptContent = styled.div`
  flex: 1;
`;

const TranscriptName = styled.div`
  font-size: 14px;
  line-height: 21px;
  font-weight: 600;
`;
const TranscriptInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TranscriptTime = styled.div`
  color: #9ca3af;
  font-size: 14px;
  line-height: 21px;
`;

const TranscriptText = styled.div`
  color: #454c53;
  font-size: 14px;
  margin-top: 4px;
  line-height: 21px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
`;

export {
  Container,
  Description,
  Header,
  NewTranscript,
  SaveButton,
  Title,
  TranscriptContainer,
  TranscriptContent,
  TranscriptIcon,
  TranscriptInfo,
  TranscriptItem,
  TranscriptName,
  TranscriptText,
  TranscriptTime,
  TranscriptWrapper,
  Wrapper
};
