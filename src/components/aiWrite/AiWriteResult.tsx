import styled, { css } from 'styled-components';
import {
  TableCss,
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiSpaceBetween
} from '../../style/cssCommon';
import { ColumDivider, RowBox } from '../../views/AIChatTab';
import SubTitle from '../SubTitle';
import Loading from '../Loading';
import PreMarkdown from '../PreMarkdown';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/store';
import ReturnButton from '../buttons/ReturnButton';
import StopButton from '../buttons/StopButton';
import Button from '../buttons/Button';
import OpenAILinkText from '../OpenAILinkText';
import icon_chat_white from '../../img/ico_chat_white.svg';
import {
  WriteType,
  resetCurrentWrite,
  setCurrentWrite
} from '../../store/slices/writeHistorySlice';
import { insertDoc } from '../../util/common';
import { activeToast } from '../../store/slices/toastSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import CreditButton from '../buttons/CreditButton';
import IconTextButton from '../buttons/IconTextButton';
import Grid from '../layout/Grid';
import React from 'react';
import { useMoveChatTab } from '../hooks/useMovePage';
import ArrowSwitcher from '../ArrowSwitcher';
import ClovaXLinkText from '../ClovaXLinkText';
import ClaudeLinkText from '../ClaudeLinkText';
import { BoldTextLength } from 'components/TextLength';

// clipboard
// import { useCopyClipboard } from '../../util/bridge';
// import IconButton from '../buttons/IconButton';
// import { ReactComponent as IconCopy } from '../../img/ico_copy.svg';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  background-color: var(--ai-purple-99-bg-light);
  height: 100%;
`;

const ResultBox = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  ${flexShrink}
  ${flexGrow}

  width: 100%;
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 8px;
  height: 60%;

  ${TableCss}
`;

const ResultWrapper = styled.div`
  ${flex}
  overflow: auto;
  white-space: break-spaces;
  width: 100%;
  padding: 8px 12px;
  height: fit-content;
`;

const ResWrapper = styled.div`
  ${flex}
  ${flexColumn}

  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: var(--ai-purple-99-bg-light);
  gap: 8px;
`;

const ButtonBox = styled.div<{ creating: boolean }>`
  ${flex}
  ${flexColumn}

  gap: 8px;
  visibility: ${({ creating }: { creating: boolean }) => (creating ? 'hidden' : 'visible')};
`;

const ResultInfo = styled.div`
  ${flex}
  ${flexColumn}
`;

const RightBox = styled.div`
  ${flex}
  ${alignItemCenter}

  align-self: flex-end;
  gap: 4px;
  height: 100%;
`;

const AiWriteResult = ({
  history,
  onClickStop,
  currentWriteId,
  submitSubject
}: {
  history: WriteType[];
  onClickStop: React.MouseEventHandler<HTMLButtonElement>;
  currentWriteId: string;
  submitSubject: (inputParam?: WriteType) => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const copyClipboard = useCopyClipboard();
  const { creating } = useAppSelector(selectTabSlice);
  const moveChat = useMoveChatTab();

  const currentWrite = history.filter((write) => write.id === currentWriteId)[0];
  const currentIndex = history.findIndex((write) => write.id === currentWriteId);

  return (
    <Wrapper>
      <ResWrapper>
        <RowBox>
          <SubTitle subTitle={t(`WriteTab.PreviewWriting`)} />
          {creating === 'none' && (
            <ReturnButton onClick={() => dispatch(resetCurrentWrite())}>
              {t(`WriteTab.ReEnterTopic`)}
            </ReturnButton>
          )}
        </RowBox>
        <ResultBox>
          {currentWrite.result.length === 0 && creating !== 'none' && (
            <Loading>{t(`WriteTab.LoadingMsg`)}</Loading>
          )}
          <ResultWrapper
            ref={(el) => {
              if (el) {
                el.scrollTo(0, el.scrollHeight);
              }
            }}>
            <PreMarkdown text={currentWrite.result} />
          </ResultWrapper>
          <ResultInfo>
            {currentWrite.result.length > 0 && creating === 'Write' && (
              <div style={{ margin: '0 auto', marginBottom: '16px', marginTop: '16px' }}>
                <StopButton onClick={onClickStop} />
              </div>
            )}
            {(creating === 'none' || currentWrite.result.length > 0) && <ColumDivider />}
            <RowBox
              cssExt={css`
                color: var(--gray-gray-70);
                font-size: 13px;
                height: 35px;
                padding: 8px 12px;
              `}>
              <BoldTextLength>
                {currentWrite.result.length > 0 && (
                  <>{t(`WriteTab.LengthInfo`, { length: currentWrite?.result.length })}</>
                )}
              </BoldTextLength>

              {creating === 'none' && currentIndex !== null && (
                <RightBox>
                  {/* <IconButton
                    iconSize="sm"
                    iconComponent={IconCopy}
                    onClick={() => copyClipboard(currentWrite.result)}
                  /> */}
                  <ArrowSwitcher
                    size="sm"
                    type="index"
                    curListIndex={currentIndex}
                    listLength={history.length}
                    onPrev={() => {
                      if (currentIndex > 0)
                        dispatch(setCurrentWrite(history[currentIndex - 1]?.id));
                    }}
                    onNext={() => {
                      if (currentIndex < history.length - 1)
                        dispatch(setCurrentWrite(history[currentIndex + 1]?.id));
                    }}
                  />
                </RightBox>
              )}
            </RowBox>
          </ResultInfo>
        </ResultBox>
        <ButtonBox creating={creating !== 'none'}>
          <Grid col={2}>
            <CreditButton
              width="full"
              borderType="gray"
              onClick={() => submitSubject(currentWrite)}>
              {t(`WriteTab.Recreating`)}
            </CreditButton>
            <Button
              width="full"
              borderType="gray"
              onClick={() => {
                insertDoc(currentWrite.result);
                dispatch(activeToast({ type: 'success', msg: t(`ToastMsg.CompleteInsert`) }));
              }}>
              {t(`WriteTab.InsertDoc`)}
            </Button>
          </Grid>
          <div>
            <IconTextButton
              width="full"
              variant="purpleGradient"
              iconSrc={icon_chat_white}
              onClick={() => moveChat(currentWrite.result)}>
              {t(`WriteTab.MoveToChating`)}
            </IconTextButton>
          </div>
          <RightBox>
            {currentWrite.version === 'clovax' ? (
              <ClovaXLinkText />
            ) : currentWrite.version === 'claude' ? (
              <ClaudeLinkText />
            ) : (
              <OpenAILinkText />
            )}
          </RightBox>
        </ButtonBox>
      </ResWrapper>
    </Wrapper>
  );
};

export default AiWriteResult;
