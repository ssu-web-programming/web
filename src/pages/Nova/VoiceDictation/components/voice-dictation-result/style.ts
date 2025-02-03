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
  color: #454c53;
  font-size: 16px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 500;
  line-height: 24px;
`;

const RecordingBox = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 32px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #c9cdd2;
`;

const FileTitle = styled.span`
  color: #454c53;
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
`;

const Duration = styled.span`
  color: #9ea4aa;
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
  border-top: 1px solid #e8ebed;
  padding-top: 16px;
`;

const LanguageLabel = styled.span`
  color: #374151;
`;

const LanguageValue = styled.div`
  display: flex;
  align-items: center;
  color: #7c3aed;
`;

const ButtonWrap = styled.div`
  width: 100%;
  height: 48px;
  min-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  background: #6f3ad0;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  & > span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }

  div {
    display: flex;
    position: absolute;
    right: 12px;
    align-items: center;
    gap: 2px;

    & > span {
      font-size: 14px;
      color: white;
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
  LanguageLabel,
  LanguageSelector,
  LanguageValue,
  RecordingBox,
  Title,
  Wrapper
};
