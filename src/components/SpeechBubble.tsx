import styled, { CSSProp } from 'styled-components';
import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const Wrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 80%;
  align-self: ${({ isUser }: { isUser: boolean }) => isUser && 'flex-end'};
`;

const SpeechBubbleWrapper = styled.div<{ cssExt: any; isUser: boolean }>`
  display: flex;
  flex-direction: column;
  width: fit-content;
  /* max-width: 80%; */
  border: solid 1px black;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;

  background-color: ${({ isUser }: { isUser: boolean }) => isUser && 'blue'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  /* align-self: ${({ isUser }: { isUser: boolean }) => isUser && 'flex-end'}; */

  ${({ cssExt }: any) => cssExt && cssExt}
`;

interface SpeechBubbleProps {
  text: string;
  isUser: boolean;
  cssExt?: CSSProp<any>;
  children?: React.ReactNode;
  outterChild?: React.ReactNode;
}

// TODO : apply css only this component (for html created by 'ReactMarkdown')

const SpeechBubble = ({ text, isUser, cssExt, children, outterChild }: SpeechBubbleProps) => {
  return (
    <Wrapper isUser={isUser}>
      <SpeechBubbleWrapper cssExt={cssExt} isUser={isUser}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </pre>
        {children}
      </SpeechBubbleWrapper>
      {outterChild}
    </Wrapper>
  );
};

export default SpeechBubble;
