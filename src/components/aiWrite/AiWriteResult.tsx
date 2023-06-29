import styled, { css } from 'styled-components';
import { TableCss, flex, flexColumn, justiSpaceBetween } from '../../style/cssCommon';
import { BoldLengthWrapper, ColumDivider, RightBox, RowBox } from '../../views/AIChatTab';
import SubTitle from '../SubTitle';
import Loading from '../Loading';
import PreMarkdown from '../PreMarkdown';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/store';
import ReturnButton from '../buttons/ReturnButton';
import StopButton from '../buttons/StopButton';
import Icon from '../Icon';
import Button from '../buttons/Button';
import OpenAILinkText from '../OpenAILinkText';
import icon_prev from '../../img/ico_arrow_prev.svg';
import icon_next from '../../img/ico_arrow_next.svg';
import icon_chat_white from '../../img/ico_chat_white.svg';
import {
  WriteType,
  resetCurrentWrite,
  setCurrentWrite
} from '../../store/slices/writeHistorySlice';
import { insertDoc } from '../../util/common';
import { activeToast } from '../../store/slices/toastSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { selectBanner } from '../../store/slices/banner';
import PSEventBannerWrite from '../PS/PSEventBannerWrite';
import CreditButton from '../buttons/CreditButton';
import IconTextButton from '../buttons/IconTextButton';
import Grid from '../layout/Grid';
import React from 'react';

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

  width: 100%;
  flex: 1;
  border-radius: 4px;
  background-color: #fff;
  box-sizing: border-box;
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
  box-sizing: border-box;
  height: fit-content;
`;

const ResWrapper = styled.div`
  ${flex}
  ${flexColumn}

  padding: 16px;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
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

const AiWriteResult = ({
  history,
  onClickStop,
  currentWriteId,
  submitSubject,
  moveChat
}: {
  history: WriteType[];
  onClickStop: React.MouseEventHandler<HTMLButtonElement>;
  currentWriteId: string;
  submitSubject: Function;
  moveChat: Function;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector(selectTabSlice);
  const { active: bannerActive } = useAppSelector(selectBanner);

  const currentWrite = history.filter((write: any) => write.id === currentWriteId)[0];
  const currentIndex = history.findIndex((write: any) => write.id === currentWriteId);

  return (
    <Wrapper>
      <ResWrapper>
        <RowBox>
          <SubTitle subTitle={t(`WriteTab.PreviewWriting`)} />
          {creating === 'none' && <ReturnButton onClick={() => dispatch(resetCurrentWrite())} />}
        </RowBox>
        <ResultBox>
          {currentWrite.result.length === 0 && creating !== 'none' && (
            <Loading>{t(`WriteTab.LoadingMsg`)}</Loading>
          )}
          <ResultWrapper>
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
                box-sizing: border-box;
              `}>
              <BoldLengthWrapper>
                {currentWrite.result.length > 0 && (
                  <>{t(`WriteTab.LengthInfo`, { length: currentWrite?.result.length })}</>
                )}
              </BoldLengthWrapper>

              {creating === 'none' && (
                <RightBox>
                  <Icon
                    size="sm"
                    cssExt={css`
                      opacity: ${currentIndex === 0 && '0.3'};
                    `}
                    iconSrc={icon_prev}
                    onClick={() => {
                      if (currentIndex > 0) {
                        dispatch(setCurrentWrite(history[currentIndex - 1]?.id));
                      }
                    }}
                  />
                  <div>
                    {history.findIndex((write: any) => write.id === currentWriteId) + 1}/
                    {history.length}
                  </div>
                  <Icon
                    size="sm"
                    cssExt={css`
                      opacity: ${currentIndex === history.length - 1 && '0.3'};
                    `}
                    iconSrc={icon_next}
                    onClick={() => {
                      if (currentIndex < history.length - 1) {
                        dispatch(setCurrentWrite(history[currentIndex + 1]?.id));
                      }
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
                dispatch(
                  activeToast({
                    active: true,
                    msg: t(`ToastMsg.CompleteInsert`),
                    isError: false
                  })
                );
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
            <OpenAILinkText />
          </RightBox>
        </ButtonBox>
      </ResWrapper>
      {bannerActive && currentWriteId && creating !== 'Write' && <PSEventBannerWrite />}
    </Wrapper>
  );
};

export default AiWriteResult;
