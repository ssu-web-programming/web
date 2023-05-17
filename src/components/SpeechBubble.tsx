import styled, { CSSProp, css } from 'styled-components';
import { RowBox } from '../views/AIChatTab';
import Icon from './Icon';
import icon_ai from '../img/ico_ai.svg';
import icon_ai_loading from '../img/loading_dot_2x.webp';
import PreMarkdown from './PreMarkdown';
import { flexColumn, flex } from '../style/cssCommon';

const Wrapper = styled.div<{ isUser: boolean }>`
  ${flexColumn}

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
  ${flexColumn}

  width: 100%;
  height: 100%;
  /* max-width: 80%; */
  box-sizing: border-box;
  border-radius: 5px;
  padding: 8px 12px 8px 12px;

  background-color: ${({ isUser }: { isUser: boolean }) =>
    isUser ? 'var(--ai-purple-70)' : 'white'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  overflow-x: auto;

  ${({ cssExt }: any) => cssExt && cssExt}
`;

const LoadingMsg = styled.div`
  ${flex}

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
          <PreMarkdown text={text} />
          {outterChild}
        </SpeechBubbleWrapper>
      </RowBox>
      {children}
    </Wrapper>
  );
};

export default SpeechBubble;
