import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  color: #7c3aed;
  margin-bottom: 8px;
`;

const CheckIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
    color: white;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.color.text.gray05};
  font-size: 16px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 500;
  line-height: 24px;
  white-space: pre-wrap;
`;

const RecordingBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.gray01};
  border-radius: 8px;
  padding: 32px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
`;

const FileTitle = styled.span`
  color: ${({ theme }) => theme.color.text.gray03};
  font-size: 16px;
  line-height: 24px;
`;

const InputFileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const InputFileTitle = styled.input`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
`;

const Duration = styled.span`
  color: ${({ theme }) => theme.color.text.gray01};
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 16px;
`;

const LanguageSelector = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.color.border.gray02};
  padding-top: 16px;
`;

const LanguageLabel = styled.span`
  color: #374151;
  color: ${({ theme }) => theme.color.text.gray02};
`;

const LanguageValue = styled.div`
  display: flex;
  align-items: center;
  color: #7c3aed;
`;

const ButtonWrap = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 48px;
  min-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  background: ${({ disabled, theme }) =>
    disabled ? theme.color.background.gray02 : theme.color.background.purple01};
  border: none; // 버튼 기본 테두리 제거
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  // button 요소의 기본 스타일 초기화
  padding: 0;
  outline: none;

  &:focus-visible {
    outline: 2px solid #6f3ad0;
    outline-offset: 2px;
  }

  & > span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ disabled }) => (disabled ? '#999999' : 'white')};
  }

  div {
    display: flex;
    position: absolute;
    right: 12px;
    align-items: center;
    gap: 2px;

    & > span {
      font-size: 14px;
      color: ${({ disabled }) => (disabled ? '#999999' : 'white')};
    }
  }
`;

export {
  ButtonWrap,
  CheckIcon,
  Container,
  Description,
  Duration,
  FileTitle,
  Header,
  InputFileTitle,
  InputFileWrapper,
  LanguageLabel,
  LanguageSelector,
  LanguageValue,
  RecordingBox,
  Title,
  Wrapper
};
