import styled, { CSSProp, css } from 'styled-components';
import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { RowBox } from '../views/AIChatTab';
import Icon from './Icon';
import icon_ai from '../img/ico_ai.svg';
import icon_ai_loading from '../img/loading_dot_2x.webp';

const Wrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
  margin-right: ${({ isUser }: { isUser: boolean }) => !isUser && '30px'};
  margin-left: ${({ isUser }: { isUser: boolean }) => isUser && '48px'};
  align-self: ${({ isUser }: { isUser: boolean }) => isUser && 'flex-end'};

  margin-top: 10px;
`;

const Profile = styled.div`
  align-self: flex-start;
  width: 32px;
  height: 32px;
  margin: 0 8px 24px 0;
  padding: 4px 4px 4px;
  border-radius: 10px;
  background-color: var(--ai-purple-95-list-pressed);
`;

const SpeechBubbleWrapper = styled.div<{ cssExt: any; isUser: boolean }>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  /* max-width: 80%; */
  border-radius: 5px;
  padding: 8px 12px 8px 12px;

  background-color: ${({ isUser }: { isUser: boolean }) =>
    isUser ? 'var(--ai-purple-70)' : 'white'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  overflow-x: scroll;

  pre {
    margin: 0;
    padding: 0;
  }

  ${({ cssExt }: any) => cssExt && cssExt}
`;

const LoadingMsg = styled.div`
  display: flex;
  font-family: NotoSansCJKKR;
  font-size: 13px;
  font-weight: 500;
  color: var(--ai-purple-50-main);
`;

interface SpeechBubbleProps {
  text: string;
  isUser: boolean;
  loadingMsg?: string;
  cssExt?: CSSProp<any>;
  children?: React.ReactNode;
  outterChild?: React.ReactNode;
}

// TODO : apply css only this component (for html created by 'ReactMarkdown')

const SpeechBubble = ({
  text,
  isUser,
  cssExt,
  children,
  outterChild,
  loadingMsg
}: SpeechBubbleProps) => {
  return (
    <Wrapper isUser={isUser}>
      <RowBox>
        {!isUser && (
          <Profile>
            <Icon
              iconSrc={loadingMsg ? icon_ai_loading : icon_ai}
              cssExt={css`
                width: 32px;
                height: 32px;
              `}
            />
          </Profile>
        )}
        <SpeechBubbleWrapper cssExt={cssExt} isUser={isUser}>
          {!isUser && <LoadingMsg>{loadingMsg}</LoadingMsg>}
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'NotoSansCJKKR', fontSize: '13px' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </pre>
          {outterChild}
        </SpeechBubbleWrapper>
      </RowBox>
      {children}
    </Wrapper>
  );
};

export default SpeechBubble;
