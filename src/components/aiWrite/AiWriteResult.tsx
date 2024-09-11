import React from 'react';
import { BoldTextLength } from 'components/TextLength';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import icon_credit_purple from '../../img/ico_credit_purple.svg';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { activeToast } from '../../store/slices/toastSlice';
import {
  resetCurrentWrite,
  setCurrentWrite,
  WriteType
} from '../../store/slices/writeHistorySlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiSpaceBetween,
  TableCss
} from '../../style/cssCommon';
import { insertDoc } from '../../util/common';
import { ColumDivider, RowBox } from '../../views/AIChatTab';
import ArrowSwitcher from '../ArrowSwitcher';
import Button from '../buttons/Button';
import IconTextButton from '../buttons/IconTextButton';
import ReturnButton from '../buttons/ReturnButton';
import StopButton from '../buttons/StopButton';
import ClaudeLinkText from '../ClaudeLinkText';
import ClovaXLinkText from '../ClovaXLinkText';
import Grid from '../layout/Grid';
import Loading from '../Loading';
import OpenAILinkText from '../OpenAILinkText';
import PreMarkdown from '../PreMarkdown';
import SubTitle from '../SubTitle';

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
  ${flex};
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
            <IconTextButton
              width="full"
              borderType="gray"
              iconSrc={icon_credit_purple}
              onClick={() => submitSubject(currentWrite)}>
              {t(`WriteTab.Recreating`)}
            </IconTextButton>
            <Button
              width="full"
              borderType="gray"
              onClick={() => {
                insertDoc(currentWrite.result);
                dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
              }}>
              {t(`WriteTab.InsertDoc`)}
            </Button>
          </Grid>
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
