import styled, { FlattenSimpleInterpolation } from 'styled-components';
import { RowBox } from '../views/AIChatTab';
import Icon from './Icon';
import icon_ai from '../img/ico_ai.svg';
import icon_ai_loading from '../img/loading_dot_2x.webp';
import PreMarkdown from './PreMarkdown';
import { flexColumn, flex } from '../style/cssCommon';

const Wrapper = styled.div<{ isUser: boolean }>`
  ${flex}
  ${flexColumn}

  width: fit-content;
  max-width: 100%;
  margin-right: ${({ isUser }: { isUser: boolean }) => !isUser && '30px'};
  margin-left: ${({ isUser }: { isUser: boolean }) => isUser && '48px'};
  align-self: ${({ isUser }: { isUser: boolean }) => isUser && 'flex-end'};
  margin: ${({ isUser }: { isUser: boolean }) =>
    isUser ? '16px 10px 0px 48px' : '16px 30px 0px 8px'};
`;

const Profile = styled.div`
  align-self: flex-start;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  padding: 4px 4px 4px;
  border-radius: 10px;
  background-color: var(--ai-purple-95-list-pressed);
  box-sizing: border-box;
`;

const SpeechBubbleWrapper = styled.div<{ cssExt?: FlattenSimpleInterpolation; isUser: boolean }>`
  ${flex}
  ${flexColumn}
  align-self: flex-start;

  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;

  background-color: ${({ isUser }: { isUser: boolean }) =>
    isUser ? 'var(--ai-purple-70)' : 'white'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  overflow-x: auto;

  ${({ cssExt }) => cssExt && cssExt}
`;

const MarkDownWrapper = styled.div`
  ${flex}

  padding: 8px 12px;
`;

const LoadingMsg = styled.div`
  ${flex}

  margin: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ai-purple-50-main);
`;

interface SpeechBubbleProps {
  text: string;
  isUser: boolean;
  loadingMsg?: string;
  cssExt?: FlattenSimpleInterpolation;
  children?: React.ReactNode;
  innerChild?: React.ReactNode;
}

// TODO : apply css only this component (for html created by 'ReactMarkdown')

const SpeechBubble = ({
  text,
  isUser,
  cssExt,
  children,
  innerChild,
  loadingMsg
}: SpeechBubbleProps) => {
  return (
    <Wrapper isUser={isUser}>
      <RowBox>
        {!isUser && (
          <Profile>
            <Icon iconSrc={loadingMsg ? icon_ai_loading : icon_ai} size="md" />
          </Profile>
        )}
        <SpeechBubbleWrapper cssExt={cssExt} isUser={isUser}>
          {!isUser && loadingMsg && <LoadingMsg>{loadingMsg}</LoadingMsg>}
          {text.length > 0 && (
            <MarkDownWrapper>
              <PreMarkdown text={text} />
            </MarkDownWrapper>
          )}
          {innerChild}
        </SpeechBubbleWrapper>
      </RowBox>
      {children}
    </Wrapper>
  );
};

export default SpeechBubble;
