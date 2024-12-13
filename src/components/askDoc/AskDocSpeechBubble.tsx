import { PropsWithChildren, useMemo } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import icon_credit_purple from '../../img/light/ico_credit_purple.svg';
import icon_ai_loading from '../../img/light/loading_dot_2x.webp';
import icon_ai from '../../img/light/nova/ico_ai_nova.svg';
import { AskDocChat } from '../../store/slices/askDoc';
import Bridge from '../../util/bridge';
import Button from '../buttons/Button';
import Icon from '../Icon';
import Grid from '../layout/Grid';
import PreMarkdown from '../PreMarkdown';

const Wrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;

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
  display: flex;
  flex-direction: column;
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
  display: flex;
`;

const LoadingMsg = styled.div`
  display: flex;
  align-items: center

  font-size: 13px;
  font-weight: 500;
  color: var(--ai-purple-50-main);
`;

const BubbleArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center

  width: 100%;
  gap: 8px;
`;

const ColumDivider = styled.span`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
`;

const BoldLengthWrapper = styled.div<{ isError?: boolean }>`
  display: flex;
  align-items: center

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
