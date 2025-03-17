import { ReactComponent as ArrowIcon } from 'img/light/nova/translation/arrow_down.svg';
import { ReactComponent as Switch } from 'img/light/nova/translation/switch.svg';
import { ReactComponent as TransFile } from 'img/light/nova/translation/trans_file.svg';
import { ReactComponent as TransTxt } from 'img/light/nova/translation/trans_txt.svg';
import { ReactComponent as DeepL } from 'img/light/nova/translation/uses_deepl_logo.svg';
import styled from 'styled-components';

const TranslationWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  display: flex;
  width: 100%;
`;

const TextAreaWrapper = styled.div`
  height: 425px;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  background: ${({ theme }) => theme.color.background.gray01};
`;

const TextAreaHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 48px;
  flex: 1 1 auto;

  & > span {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  & > div:nth-child(1) {
    flex: 1 1 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: ${({ theme }) => theme.color.text.gray04};
  }

  & > div:nth-child(2) {
    flex-basis: 24px;
    height: 24px;
    text-align: center;
  }

  & > div:nth-child(3) {
    flex: 1 1 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: ${({ theme }) => theme.color.text.gray04};

    & > span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 322px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray04};
  padding: 12px 32px 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};
  background: ${({ theme }) => theme.color.background.gray01};
  white-space: pre-line;
  resize: none;
`;

const TextInputWrapper = styled.div`
  position: relative;
  height: 322px;
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 8px;
  cursor: pointer;
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

const StyledTransTxt = styled(TransTxt)<{
  $isActive?: boolean;
}>`
  & path {
    fill: ${({ $isActive, theme }) => ($isActive ? theme.color.background.purple01 : '')};
  }
`;

const StyledTransFile = styled(TransFile)<{
  $isActive?: boolean;
}>`
  & path {
    fill: ${({ $isActive, theme }) => ($isActive ? theme.color.background.purple01 : '')};
  }
`;

const StyledArrowIcon = styled(ArrowIcon)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;

const StyledSwitch = styled(Switch)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;

const StyledDeepL = styled(DeepL)`
  & path {
    fill: ${({ theme }) => theme.color.background.deepNavy};
  }
`;

const TranslationButton = styled.div<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6f3ad0;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 30px;

  background: ${({ isActive, theme }) =>
    isActive ? 'var(--ai-purple-50-main)' : theme.color.background.gray02};

  cursor: ${(props) => (props.isActive ? 'pointer' : 'default')};

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme, isActive }) => (isActive ? 'var(--white)' : theme.color.text.gray01)};
  }
`;

const FileUploaderWrapper = styled.div`
  width: 100%;
  height: 322px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};
`;

export {
  CloseIconWrapper,
  FileUploaderWrapper,
  StyledArrowIcon,
  StyledDeepL,
  StyledSwitch,
  StyledTransFile,
  StyledTransTxt,
  TextArea,
  TextAreaBottom,
  TextAreaHeader,
  TextAreaWrapper,
  TextInputWrapper,
  ToggleWrapper,
  TranslationButton,
  TranslationWrapper
};
