import styled, { CSSProp } from 'styled-components';
import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { RowBox } from '../views/AIChatTab';

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
  width: 50px;
  height: 50px;
  background-color: purple;
  align-self: flex-start;
`;

const SpeechBubbleWrapper = styled.div<{ cssExt: any; isUser: boolean }>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  /* max-width: 80%; */
  border: solid 1px black;
  border-radius: 5px;
  padding: 5px;
  margin: 0px 5px 10px 5px;

  background-color: ${({ isUser }: { isUser: boolean }) => isUser && 'blue'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  align-self: ${({ isUser }: { isUser: boolean }) => isUser && 'flex-end'};

  ${({ cssExt }: any) => cssExt && cssExt}
`;

const LoadingMsg = styled.div`
  display: flex;
  color: blue;
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
        {!isUser && <Profile />}
        <SpeechBubbleWrapper cssExt={cssExt} isUser={isUser}>
          <LoadingMsg>{loadingMsg}</LoadingMsg>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
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
