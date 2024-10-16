import { PropsWithChildren, useMemo } from 'react';
import ClaudeLinkText from 'components/ClaudeLinkText';
import icon_credit_purple from 'img/ico_credit_purple.svg';
import { useTranslation } from 'react-i18next';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import icon_ai from '../img/ico_ai.svg';
import icon_ai_loading from '../img/loading_dot_2x.webp';
import { Chat } from '../store/slices/chatHistorySlice';
import { selectRecFuncSlice } from '../store/slices/recFuncSlice';
import { selectTabSlice } from '../store/slices/tabSlice';
import { activeToast } from '../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { alignItemCenter, flex, flexColumn, justiSpaceBetween } from '../style/cssCommon';
import { insertDoc } from '../util/common';
import { ColumDivider, RowBox } from '../views/AIChatTab';

import Button from './buttons/Button';
import IconTextButton from './buttons/IconTextButton';
import { RowWrapBox } from './chat/RecommendBox/ChatRecommend';
import { formRecList } from './chat/RecommendBox/FormRec';
import { REC_ID_LIST } from './chat/RecommendBox/FunctionRec';
import Grid from './layout/Grid';
import ClovaXLinkText from './ClovaXLinkText';
import Icon from './Icon';
import OpenAILinkText from './OpenAILinkText';
import PreMarkdown from './PreMarkdown';
import { BoldTextLength } from './TextLength';

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

const SpeechBubbleWrapper = styled.div<{ cssExt?: FlattenSimpleInterpolation; isUser: boolean }>`
  ${flex}
  ${flexColumn}
  align-self: flex-start;

  width: 100%;
  border-radius: 10px;
  background-color: ${({ isUser }: { isUser: boolean }) =>
    isUser ? 'var(--ai-purple-70)' : 'white'};
  color: ${({ isUser }: { isUser: boolean }) => isUser && 'white'};
  overflow-x: auto;

  ${(props) => (props.cssExt ? props.cssExt : '')};
`;

const MarkDownWrapper = styled.div`
  ${flex};

  padding: 8px 12px;
`;

const LoadingMsg = styled.div`
  ${flex};

  margin: 8px 12px;
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

interface SpeechBubbleProps {
  loadingId?: string | null;
  cssExt?: FlattenSimpleInterpolation;
  chat: Chat;
  submitChat?: (chat?: Chat) => void;
  retryOrigin?: string | null;
  setRetryOrigin?: React.Dispatch<React.SetStateAction<string | null>>;
  chatInput?: string;
}

// TODO : apply css only this component (for html created by 'ReactMarkdown')

const SpeechBubble = (props: PropsWithChildren<SpeechBubbleProps>) => {
  const {
    cssExt,
    loadingId,
    chat,
    retryOrigin,
    setRetryOrigin = () => {},
    submitChat = () => {},
    chatInput = '',
    children
  } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const copyClipboard = useCopyClipboard();
  const { creating } = useAppSelector(selectTabSlice);
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);

  const loadingMsg = useMemo(() => {
    if (loadingId !== chat.id) return undefined;

    if (retryOrigin) return t(`ChatingTab.LoadingMsg.ReCreating`);

    const isFirstRec = formRecList.filter((rec) => rec.id === selectedRecFunction?.id).length > 0;
    if (
      isFirstRec ||
      (!isFirstRec && !selectedRecFunction && chatInput.length > 0) ||
      (selectedRecFunction?.id === REC_ID_LIST.START_NEW_CHATING && chatInput.length > 0)
    ) {
      return t(`ChatingTab.LoadingMsg.Creating`);
    }

    switch (selectedRecFunction?.id) {
      case REC_ID_LIST.RESUME_WRITING:
        if (chatInput.length > 0) return t(`ChatingTab.LoadingMsg.ContitnueWriting_input`);
        else return t(`ChatingTab.LoadingMsg.ContitnueWriting`);

      case REC_ID_LIST.SUMMARY:
        if (chatInput.length > 0) return t(`ChatingTab.LoadingMsg.Summary_input`);
        else return t(`ChatingTab.LoadingMsg.Summary`);

      case REC_ID_LIST.TRANSLATE:
        if (chatInput.length > 0 && selectedSubRecFunction)
          return t(`ChatingTab.LoadingMsg.Translate_input`, {
            language: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.id}`)
          });
        else if (selectedSubRecFunction)
          return t(`ChatingTab.LoadingMsg.Translate`, {
            language: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.id}`)
          });
        break;
      case REC_ID_LIST.CHANGE_TEXT_STYLE:
        if (chatInput.length > 0 && selectedSubRecFunction)
          return t(`ChatingTab.LoadingMsg.ChangeStyle_input`, {
            style: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.id}`)
          });
        else if (selectedSubRecFunction)
          return t(`ChatingTab.LoadingMsg.ChangeStyle`, {
            style: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.id}`)
          });
        break;
      case REC_ID_LIST.MODIFY_TEXT:
        if (chatInput.length > 0) return t(`ChatingTab.LoadingMsg.Grammar_input`);
        else return t(`ChatingTab.LoadingMsg.Grammar`);
    }

    return '';
  }, [chatInput, selectedRecFunction, selectedSubRecFunction, t, chat.id, loadingId, retryOrigin]);

  const isUser = useMemo(() => chat.role === 'user', [chat.role]);
  const text = useMemo(() => (chat.role === 'assistant' ? chat.result : chat.input), [chat]);

  return (
    <Wrapper isUser={isUser}>
      <BubbleArea>
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
          {chat.role === 'assistant' && (
            <>
              <ColumDivider />
              <RowWrapBox
                cssExt={css`
                  padding: 9px 12px 12px 12px;
                  gap: 8px;
                `}>
                <RowBox>
                  <BoldTextLength>
                    {t(`WriteTab.LengthInfo`, { length: text.length })}
                  </BoldTextLength>
                  {/* {chat.id !== loadingId && (
                    <IconButton
                      iconSize="sm"
                      iconComponent={IconCopy}
                      onClick={() => copyClipboard(text)}
                    />
                  )} */}
                </RowBox>

                {chat.id !== loadingId && (
                  <Grid col={retryOrigin !== chat.id ? 2 : 1}>
                    {retryOrigin !== chat.id && (
                      <IconTextButton
                        width="full"
                        borderType="gray"
                        onClick={() => {
                          submitChat(chat);
                          setRetryOrigin(chat.id);
                        }}
                        disable={creating === 'Chatting'}
                        iconSrc={icon_credit_purple}
                        iconSize={16}>
                        {t(`WriteTab.Recreating`)}
                      </IconTextButton>
                    )}
                    <Button
                      width="full"
                      variant="purpleGradient"
                      onClick={() => {
                        insertDoc(text);
                        dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                      }}>
                      {t(`WriteTab.InsertDoc`)}
                    </Button>
                  </Grid>
                )}
              </RowWrapBox>
            </>
          )}
          {children}
        </SpeechBubbleWrapper>
      </BubbleArea>

      {chat.role === 'assistant' && !loadingMsg && (
        <LisenceRight>
          {chat.version === 'clovax' ? (
            <ClovaXLinkText />
          ) : chat.version === 'claude' ? (
            <ClaudeLinkText />
          ) : (
            <OpenAILinkText />
          )}
        </LisenceRight>
      )}
    </Wrapper>
  );
};

export default SpeechBubble;
