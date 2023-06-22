import styled, { css } from 'styled-components';
import {
  TableCss,
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiSpaceBetween,
  purpleBtnCss
} from '../../style/cssCommon';
import { BoldLengthWrapper, ColumDivider, RightBox, RowBox } from '../../views/AIChatTab';
import SubTitle from '../SubTitle';
import Loading from '../Loading';
import PreMarkdown from '../PreMarkdown';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/store';
import RecreatingButton from '../RecreatingButton';
import StopButton from '../StopButton';
import Icon from '../Icon';
import Button from '../Button';
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

const Wrapper = styled.div`
  ${flexColumn}
  background-color: var(--ai-purple-99-bg-light);
  height: 100%;
`;

const ResultBox = styled.div`
  width: 100%;
  flex: 1;
  border-radius: 4px;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 8px;
  height: 60%;
  ${flexColumn}
  ${justiSpaceBetween}

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
  ${flexColumn}
  gap: 8px;

  visibility: ${({ creating }: { creating: boolean }) => (creating ? 'hidden' : 'visible')};
`;

const ResultInfo = styled.div`
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
  onClickStop: Function;
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
          {creating === 'none' && (
            <RecreatingButton
              onClick={() => {
                // dispatch(initWriteHistory()); // 같은 주제끼리만 저장할지 의논 필요
                // initAllInput();
                dispatch(resetCurrentWrite());
              }}
            />
          )}
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
              <StopButton
                cssExt={css`
                  margin: 0 auto;
                  margin-bottom: 16px;
                  margin-top: 16px;
                `}
                onClick={onClickStop}
              />
            )}
            {(creating === 'none' || currentWrite.result.length > 0) && <ColumDivider />}
            <RowBox
              cssExt={css`
                ${alignItemCenter}
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
                    cssExt={css`
                      width: 16px;
                      height: 16px;
                      margin-right: 11px;
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
                    cssExt={css`
                      width: 16px;
                      height: 16px;
                      margin-left: 11px;
                      opacity: ${currentIndex === history.length - 1 && '0.3'};
                    `}
                    iconSrc={icon_next}
                    onClick={() => {
                      if (currentIndex < history.length - 1) {
                        dispatch(setCurrentWrite(history[currentIndex + 1]?.id));
                      }
                    }}
                  />
                  {/* <CopyIcon
                          cssExt={css`
                            margin-left: 12px;
                          `}
                          onClick={() => {
                            // TODO: 복사 로직

                            dispatch(
                              activeToast({
                                active: true,
                                msg: t(`ToastMsg.CompleteCopy`),
                                isError: false
                              })
                            );
                          }}
                        /> */}
                </RightBox>
              )}
            </RowBox>
          </ResultInfo>
        </ResultBox>
        <ButtonBox creating={creating !== 'none'}>
          <RowBox
            cssExt={css`
              gap: 8px;
            `}>
            <Button
              cssExt={css`
                margin: 0px;
              `}
              isCredit={true}
              onClick={() => {
                submitSubject(currentWrite);
              }}>
              {t(`WriteTab.Recreating`)}
            </Button>
            <Button
              cssExt={css`
                margin: 0px;
              `}
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
          </RowBox>
          <div>
            <Button
              icon={icon_chat_white}
              cssExt={css`
                flex: none;
                width: 100%;
                box-sizing: border-box;
                margin: 0;
                ${purpleBtnCss}
              `}
              onClick={() => {
                moveChat(currentWrite.result);
              }}>
              {t(`WriteTab.MoveToChating`)}
            </Button>
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
