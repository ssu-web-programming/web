import styled, { css } from 'styled-components';
import SubTitle from '../components/SubTitle';
import {
  BoldLengthWrapper,
  ColumDivider,
  LengthWrapper,
  RightBox,
  RowBox,
  exampleList
} from './AIChatTab';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useRef, useState } from 'react';
import OpenAILinkText from '../components/OpenAILinkText';
import { useDispatch } from 'react-redux';
import { calcToken } from '../api/usePostSplunkLog';
import { activeToast } from '../store/slices/toastSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  WriteType,
  addWriteHistory,
  resetCurrentWrite,
  selectWriteHistorySlice,
  setCurrentWrite,
  updateWriteHistory
} from '../store/slices/writeHistorySlice';
import { useAppSelector } from '../store/store';
import { selectTabSlice } from '../store/slices/tabSlice';
import ExTextbox from '../components/ExTextbox';
import IconButton from '../components/IconButton';
import { formRecList } from '../components/FuncRecBox';
import icon_write from '../img/ico_creating_text_white.svg';
import icon_prev from '../img/ico_arrow_prev.svg';
import icon_next from '../img/ico_arrow_next.svg';
import PreMarkdown from '../components/PreMarkdown';
import CopyIcon from '../components/CopyIcon';
import StopButton from '../components/StopButton';
import icon_chat_white from '../img/ico_chat_white.svg';
import {
  TableCss,
  flexColumn,
  flex,
  alignItemCenter,
  purpleBtnCss,
  justiSpaceBetween,
  justiCenter,
  flexGrow,
  flexShrink,
  grid3Btn
} from '../style/cssCommon';
import RecreatingButton from '../components/RecreatingButton';
import { useMoveChatTab } from '../components/hooks/useMovePage';
import { setCreating } from '../store/slices/tabSlice';
import Loading from '../components/Loading';
import { JSON_CONTENT_TYPE, CHAT_STREAM_API } from '../api/constant';
import { calLeftCredit, insertDoc } from '../util/common';
import useApiWrapper from '../api/useApiWrapper';
import { useTranslation } from 'react-i18next';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { GPT_EXCEEDED_LIMIT } from '../error/error';
import NoBorderButton from '../components/NoBorderButton';

const WriteInputPage = styled.div`
  ${flexColumn}
  padding: 16px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  gap: 16px;
`;

const InputArea = styled.div`
  ${flex}

  width: 100%;
  /* margin-bottom: 17px; */
`;

const ResultBox = styled.div`
  width: 100%;
  max-height: 70%;
  flex: 1;
  border-radius: 4px;
  background-color: #fff;
  /* padding: 8px 12px 0px 12px; */
  box-sizing: border-box;
  margin-bottom: 8px;
  height: 620px;
  ${flexGrow}
  ${flexShrink}
  ${flexColumn}
  ${justiSpaceBetween}

  ${TableCss}
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-weight: 500;
  color: var(--ai-purple-50-main);
  word-wrap: break-word;
  div {
    width: 196px;
    text-align: center;
  }
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}
`;

const ResultWrapper = styled.div`
  ${flex}
  overflow: auto;
  white-space: break-spaces;
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
`;

const ResWrapper = styled.div`
  ${flexColumn}
  padding: 16px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--ai-purple-99-bg-light);

  gap: 8px;
`;

const TitleInputSet = styled.div`
  ${flexColumn}
  gap: 8px;
`;

export const Grid3BtnContainer = styled.div`
  ${grid3Btn}

  width: 100%;
  gap: 8px;
`;

const lengthList = [
  { title: 'Short', length: 'short' },
  { title: 'Medium', length: 'medium' },
  { title: 'Long', length: 'long' }
];

interface FormListType {
  id: string;
  icon?: string;
  title: string;
}

interface LengthListType {
  title: string;
  length: string;
}

const subjectMaxLength = 1000;

const AIWriteTab = () => {
  const apiWrapper = useApiWrapper();
  const [subject, setSubject] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<FormListType>(formRecList[0]);
  const [selectedLength, setSelectedLength] = useState<LengthListType>(lengthList[0]);
  const { t } = useTranslation();

  const { creating } = useAppSelector(selectTabSlice);
  const errorHandle = useErrorHandle();

  const stopRef = useRef<boolean>(false);
  const endRef = useRef<any>();

  const moveChat = useMoveChatTab();

  const dispatch = useDispatch();
  const { history, currentWriteId } = useAppSelector(selectWriteHistorySlice);

  const submitSubject = async (inputParam?: WriteType) => {
    let resultText = '';
    let splunk = null;
    let input = '';
    try {
      const assistantId = uuidv4();

      let preProc = {
        type: '',
        arg1: '',
        arg2: ''
      };

      if (inputParam) {
        input = inputParam.input;
        preProc = inputParam.preProcessing;
      } else {
        input = subject;
        preProc = {
          type: 'create_text',
          arg1: selectedForm.id, // id로 수정
          arg2: selectedLength.length.toString()
        };
      }

      dispatch(
        addWriteHistory({ id: assistantId, input: input, preProcessing: preProc, result: '' })
      );
      dispatch(setCurrentWrite(assistantId));

      dispatch(setCreating('Write'));

      const { res, logger } = await apiWrapper(CHAT_STREAM_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        //   responseType: 'stream',
        body: JSON.stringify({
          history: [
            {
              content: input,
              role: 'user',
              preProcessing: preProc
            }
          ]
        }),
        method: 'POST'
      });
      splunk = logger;

      if (res.status !== 200) {
        if (res.status === 400) throw new Error(GPT_EXCEEDED_LIMIT);
        else throw res;
      }

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      dispatch(
        activeToast({
          active: true,
          msg: t(`ToastMsg.StartCreating`, {
            deductionCredit: deductionCredit,
            leftCredit: leftCredit
          }),
          isError: false
        })
      );

      const reader = res.body?.getReader();
      var enc = new TextDecoder('utf-8');

      while (reader) {
        // if (isFull) break;
        const { value, done } = await reader.read();

        if (stopRef?.current) {
          reader.cancel();
          dispatch(
            activeToast({
              active: true,
              msg: t(`ToastMsg.StopMsg`),
              isError: false
            })
          );
          break;
        }

        if (done) {
          // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);

          break;
        }

        const decodeStr = enc.decode(value);
        dispatch(
          updateWriteHistory({
            id: assistantId,
            result: decodeStr,
            input: input,
            preProcessing: preProc
          })
        );
        resultText += decodeStr;

        endRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }

      if (!stopRef.current) dispatch(setCreating('none'));
    } catch (error: any) {
      dispatch(resetCurrentWrite());
      errorHandle(error);
    } finally {
      if (splunk) {
        const input_token = calcToken(input);
        const output_token = calcToken(resultText);
        splunk({
          dp: 'ai.write',
          el: 'create_text',
          input_token,
          output_token
        });
      }
      stopRef.current = false;
      dispatch(setCreating('none'));
    }
  };

  const currentWrite = history.filter((write) => write.id === currentWriteId)[0];
  const currentIndex = history.findIndex((write) => write.id === currentWriteId);
  return (
    <>
      {!currentWriteId ? (
        <WriteInputPage>
          <TitleInputSet>
            <SubTitle subTitle={t(`WriteTab.WriteTopic`)} />
            <InputArea>
              <ExTextbox
                exampleList={exampleList}
                maxtTextLen={subjectMaxLength}
                value={subject}
                placeholder={t(`WriteTab.WriteTextboxPlacehold`) || ''}
                setValue={(val: string) => {
                  setSubject(val);
                }}></ExTextbox>
            </InputArea>
          </TitleInputSet>

          <TitleInputSet>
            <SubTitle subTitle={t(`WriteTab.SelectForm`)} />
            <Grid3BtnContainer>
              {formRecList.map((form) => (
                <div>
                  <IconButton
                    iconCssExt={css`
                      background-color: ${selectedForm.id === form.id
                        ? 'var(--ai-purple-97-list-over)'
                        : 'var(--gray-gray-20)'};
                      box-sizing: border-box;
                    `}
                    key={form.id}
                    title={t(`FormList.${form.title}`)}
                    onClick={() => {
                      setSelectedForm(form);
                    }}
                    selected={selectedForm ? (selectedForm.id === form.id ? true : false) : false}
                    icon={selectedForm.id === form.id ? form.selectedIcon : form.icon}
                  />
                </div>
              ))}
            </Grid3BtnContainer>
          </TitleInputSet>

          <TitleInputSet>
            <SubTitle subTitle={t(`WriteTab.SelectResultLength`)} />
            <Grid3BtnContainer>
              {lengthList.map((length, index) => (
                <NoBorderButton
                  key={index}
                  onClick={() => {
                    setSelectedLength(length);
                  }}
                  selected={
                    selectedLength
                      ? selectedLength.length === length.length
                        ? true
                        : false
                      : false
                  }
                  cssExt={css`
                    border: none;
                    background-color: ${selectedLength && selectedLength.length === length.length
                      ? `var(--ai-purple-97-list-over)`
                      : 'var(--gray-gray-20)'};
                    flex: none;
                    font-size: 13px;
                    font-weight: ${selectedLength?.length === length.length ? 'border' : 'none'};
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.54;
                    letter-spacing: normal;

                    box-sizing: border-box;

                    width: 100%;
                    padding: 4px 0px;
                    ${flexShrink}
                    ${flexGrow}
                  `}>
                  {t(`WriteTab.Length.${length.title}`)}
                </NoBorderButton>
              ))}
            </Grid3BtnContainer>
          </TitleInputSet>

          <div>
            <Button
              disable={subject.length === 0}
              isCredit={true}
              cssExt={css`
                ${purpleBtnCss}
                width: 100%;
                margin-top: 4px;
              `}
              onClick={() => {
                if (subject.length === 0) {
                  return;
                }

                submitSubject();
              }}
              icon={icon_write}>
              {t(`WriteTab.WritingArticle`)}
            </Button>
          </div>
        </WriteInputPage>
      ) : (
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
            {currentWrite.result.length === 0 && creating === 'Write' ? (
              <LoadingWrapper>
                <Loading>{t(`WriteTab.LoadingMsg`)}</Loading>
              </LoadingWrapper>
            ) : (
              <ResultWrapper>
                <PreMarkdown text={currentWrite.result} endRef={endRef} />
              </ResultWrapper>
            )}
            <div>
              {currentWrite.result.length > 0 && creating === 'Write' && (
                <StopButton
                  cssExt={css`
                    margin: 0 auto;
                    margin-bottom: 16px;
                    margin-top: 16px;
                  `}
                  onClick={() => {
                    stopRef.current = true;
                  }}
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
                      {history.findIndex((write) => write.id === currentWriteId) + 1}/
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
            </div>
          </ResultBox>
          {creating === 'none' && (
            <>
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
            </>
          )}
        </ResWrapper>
      )}
    </>
  );
};

export default AIWriteTab;
