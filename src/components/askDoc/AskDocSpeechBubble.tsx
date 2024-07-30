import styled, { css } from 'styled-components';
import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import icon_ai_loading from '../../img/loading_dot_2x.webp';
import PreMarkdown from '../PreMarkdown';
import { flexColumn, flex, justiSpaceBetween, alignItemCenter } from '../../style/cssCommon';
import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '../layout/Grid';
import { AskDocChat } from '../../store/slices/askDoc';
import Button from '../buttons/Button';
import Bridge from '../../util/bridge';
import IconTextButton from 'components/buttons/IconTextButton';
import icon_credit_purple from '../../img/ico_credit_purple.svg';

const Wrapper = styled.div<{ isUser: boolean }>`
  ${flex}
  ${flexColumn}

  min-height: fit-content;
  width: fit-content;
  max-width: 100%;

  & + & {
    margin-top: 16px;
  }

  ${({ isUser }) =>
    isUser
      ? css`
          margin: 0px 10px 0px 48px;
          align-self: flex-end;
        `
      : css`
          margin: 0px 30px 0px 8px;
          align-self: flex-start;
        `};
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
  margin-right: 12px;
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
  ${alignItemCenter}

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

const ColumDivider = styled.span`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
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
  chat: AskDocChat;
  onMore?: () => void;
}

const AskDocSpeechBubble = (props: PropsWithChildren<AskDocSpeechBubbleProps>) => {
  const { loadingId, chat, children, onMore } = props;
  const { t } = useTranslation();

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
              <BoldLengthWrapper>
                {t(`WriteTab.LengthInfo`, { length: text.trim().length })}
              </BoldLengthWrapper>
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
                            width={64}
                            variant="gray"
                            cssExt={css`
                              color: var(--gray-gray-80-02);
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
                    <IconTextButton
                      width="full"
                      variant="purpleGradient"
                      onClick={onMore}
                      disable={loadingId !== null}
                      iconSrc={icon_credit_purple}>
                      <span>{t('AskDoc.GetMoreInformation')}</span>
                    </IconTextButton>
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
