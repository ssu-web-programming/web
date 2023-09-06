import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import icon_ai_loading from '../../img/loading_dot_2x.webp';
import PreMarkdown from '../PreMarkdown';
import { flexColumn, flex, justiSpaceBetween, alignItemCenter } from '../../style/cssCommon';
// import OpenAILinkText from '../OpenAILinkText';
import { PropsWithChildren, useMemo } from 'react';
import { RowWrapBox } from '../chat/RecommendBox/ChatRecommend';
import { useTranslation } from 'react-i18next';
import Grid from '../layout/Grid';
import CreditButton from '../buttons/CreditButton';
import { AskDocChat } from '../../store/slices/askDoc';
import Button from '../buttons/Button';
import Bridge from '../../util/bridge';

// clipboard
// import { useCopyClipboard } from '../util/bridge';
// import IconButton from './buttons/IconButton';
// import { ReactComponent as IconCopy } from '../img/ico_copy.svg';

const Wrapper = styled.div<{ isUser: boolean }>`
  ${flex}
  ${flexColumn}

  min-height: fit-content;

  width: fit-content;
  max-width: 100%;
  margin-right: ${({ isUser }: { isUser: boolean }) => !isUser && '30px'};
  margin-left: ${({ isUser }: { isUser: boolean }) => isUser && '48px'};
  align-self: ${({ isUser }: { isUser: boolean }) => isUser && 'flex-end'};
  margin: ${({ isUser }: { isUser: boolean }) =>
    isUser ? '0px 10px 0px 48px' : '0px 30px 0px 8px'};

  & + & {
    margin-top: 16px;
  }
`;

const Profile = styled.div`
  align-self: flex-start;
  width: 32px;
  height: 32px;
  padding: 4px 4px 4px;
  border-radius: 10px;
  background-color: var(--ai-purple-95-list-pressed);
`;

const AskDocSpeechBubbleWrapper = styled.div<{
  isUser: boolean;
}>`
  ${flex}
  ${flexColumn}
  align-self: flex-start;

  width: 100%;
  border-radius: 10px;
  background-color: ${({ isUser }: { isUser: boolean }) =>
    isUser ? 'var(--ai-purple-70)' : 'white'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  overflow-x: auto;

  font-size: 13px;
  & > div {
    padding: 8px 12px;
  }
`;

const MarkDownWrapper = styled.div`
  ${flex}
`;

const LoadingMsg = styled.div`
  ${flex}

  font-size: 13px;
  font-weight: 500;
  color: var(--ai-purple-50-main);
`;

const BubbleArea = styled.div`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}

  width: 100%;
  gap: 8px;
`;

const LisenceRight = styled.div`
  ${flex}
  ${alignItemCenter}
  
  align-self: flex-end;
  margin-top: 9px;
`;

const ColumDivider = styled.span`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
`;

const RowBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;
  gap: 6px;

  ${({ cssExt }) => cssExt && cssExt}
`;

const BoldLengthWrapper = styled.div<{ isError?: boolean }>`
  ${flex}
  ${alignItemCenter}

  font-size: 12px;
  color: var(--gray-gray-70);

  ${({ isError }) =>
    isError !== undefined &&
    css`
      color: ${isError ? 'var(--sale)' : 'var(--gray-gray-70)'};
    `}
  font-weight: 500;
`;

interface AskDocSpeechBubbleProps {
  loadingId: string | null;
  cssExt?: FlattenSimpleInterpolation;
  chat: AskDocChat;
  onMore?: () => void;
}

const AskDocSpeechBubble = (props: PropsWithChildren<AskDocSpeechBubbleProps>) => {
  const { loadingId, chat, children, onMore } = props;
  const { t } = useTranslation();
  // const copyClipboard = useCopyClipboard();

  const loadingMsg = useMemo(() => {
    if (chat.role === 'info') {
      return t('AskDoc.LoadingMsg.Info');
    }

    switch (chat?.info?.request) {
      case 'askDoc':
        return t('AskDoc.LoadingMsg.AskDoc');
      case 'gpt':
        return t('AskDoc.LoadingMsg.Gpt');
      default:
        return t('AskDoc.LoadingMsg.AskDoc');
    }
  }, [chat, t]);

  const isLoading = useMemo(() => loadingId === chat.id, [chat.id, loadingId]);
  const isUser = useMemo(() => chat.role === 'user', [chat.role]);
  const text = useMemo(() => (chat.role === 'assistant' ? chat.result : chat.input), [chat]);

  return (
    <Wrapper isUser={isUser}>
      <BubbleArea>
        {!isUser && (
          <Profile>
            <Icon iconSrc={isLoading && loadingMsg ? icon_ai_loading : icon_ai} size="md" />
          </Profile>
        )}
        <AskDocSpeechBubbleWrapper isUser={isUser}>
          {!isUser && isLoading && loadingMsg && <LoadingMsg>{loadingMsg}</LoadingMsg>}
          {text.length > 0 && (
            <MarkDownWrapper>
              <PreMarkdown text={text} />
            </MarkDownWrapper>
          )}
          {chat.role === 'assistant' && (
            <>
              <ColumDivider />
              <RowWrapBox
                cssExt={css`
                  padding: 9px 12px 12px 12px;
                  gap: 8px;
                `}>
                <RowBox>
                  <BoldLengthWrapper>
                    {t(`WriteTab.LengthInfo`, { length: text.length })}
                  </BoldLengthWrapper>
                  {/* {chat.id !== loadingId && (
                    <IconButton
                      iconSize="sm"
                      iconComponent={IconCopy}
                      onClick={() => copyClipboard(text)}
                    />
                  )} */}
                </RowBox>
              </RowWrapBox>
              <ColumDivider />
              {!isLoading && chat?.info?.request === 'askDoc' && (
                <>
                  {chat?.info?.page && chat.info.page.length > 0 && (
                    <div>
                      <BoldLengthWrapper>{t('AskDoc.ReferencedPage')}</BoldLengthWrapper>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        {chat.info.page.map((p, index) => (
                          <Button
                            key={index}
                            width={'fit'}
                            variant="gray"
                            cssExt={css`
                              font-size: 13px;
                              color: var(--gray-gray-80-02);
                              width: 64px;
                            `}
                            onClick={() => {
                              Bridge.callBridgeApi('movePage', p);
                            }}>
                            p{p}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  <Grid col={1}>
                    <CreditButton
                      width="full"
                      variant="purpleGradient"
                      onClick={onMore}
                      disable={loadingId !== null}>
                      {t('AskDoc.GetMoreInformation')}
                    </CreditButton>
                  </Grid>
                </>
              )}
            </>
          )}
          {children}
        </AskDocSpeechBubbleWrapper>
      </BubbleArea>

      {/* {chat.role === 'assistant' && !isLoading && (
        <LisenceRight>
          <OpenAILinkText />
        </LisenceRight>
      )} */}
    </Wrapper>
  );
};

export default AskDocSpeechBubble;
