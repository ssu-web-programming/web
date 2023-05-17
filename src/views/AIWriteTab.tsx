import styled, { css } from 'styled-components';
import SubTitle from '../components/SubTitle';
import { ColumDivider, LengthWrapper, RightBox, RowBox } from './AIChatTab';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useRef, useState } from 'react';
import OpenAILinkText from '../components/OpenAILinkText';
import { useDispatch } from 'react-redux';
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
import { firstRecList } from '../img/aiChat/FuncRecBox';
import icon_write from '../img/ico_creating_text_white.svg';
import icon_prev from '../img/ico_arrow_prev.svg';
import icon_next from '../img/ico_arrow_next.svg';
import PreMarkdown from '../components/PreMarkdown';
import CopyIcon from '../components/CopyIcon';
import StopButton from '../components/StopButton';
import icon_chat_white from '../img/ico_chat_white.svg';
import { TableCss, purpleBtnCss } from '../style/cssCommon';
import RecreatingButton from '../components/RecreatingButton';
import { useMoveChatTab } from '../components/hooks/useMovePage';
import { setLoadingTab } from '../store/slices/tabSlice';
import Loading from '../components/Loading';
import { JSON_CONTENT_TYPE, SESSION_KEY_LIST, CHAT_STREAM_API } from '../api/constant';
import { insertDoc } from '../util/common';
import { selectLoginSessionSlice } from '../store/slices/loginSession';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const InputArea = styled.div`
  display: flex;
  /* flex-direction: column;
  margin: 10px 0px 10px;
  border: solid 1px black;
  border-radius: 4px;
  border: solid 1px var(--gray-gray-50); */
  width: 100%;
`;

const TextButton = styled.div`
  display: flex;
  cursor: pointer;
`;

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-height: 70%;
  flex: 1;
  border-radius: 4px;
  background-color: #fff;
  padding: 8px 12px 0px 12px;
  box-sizing: border-box;
  margin-bottom: 16px;

  ${TableCss}
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--ai-purple-50-main);
  word-wrap: break-word;
  div {
    width: 196px;
    text-align: center;
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  overflow: auto;
  white-space: break-spaces;
`;

const RowStartBox = styled(RowBox)`
  justify-content: flex-start;
  margin: 8px 0px 8px 0px;
  box-sizing: border-box;
`;

const ResWrapper = styled(Wrapper)`
  background-color: var(--ai-purple-99-bg-light);
`;

const lengthList = [
  { title: '300자', length: 300 },
  { title: '500자', length: 500 },
  { title: '800자', length: 800 }
  // { title: '1000자', length: 1000 }
];

interface FormListType {
  id: string;
  icon?: string;
  title: string;
}

interface LengthListType {
  title: string;
  length: number;
}

const subjectMaxLength = 1000;
const exampleSubject = [
  '건강한 생활습관을 위한 효과적인 5가지 방법',
  '배달 서비스 마케팅 아이디어를 브레인스토밍하고 각 아이디어가 지닌 장점 설명',
  '비 오는 바다 주제의 소설 시놉시스',
  '중고 의류 쇼핑몰 CEO 인터뷰 질문 목록 10가지',
  '부모님 생일 선물을 추천해줘',
  '문서 작성을 효율적으로 하는 방법'
];

const AIWriteTab = () => {
  const [subject, setSubject] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<FormListType>(firstRecList[0]);
  const [selectedLength, setSelectedLength] = useState<LengthListType>(lengthList[0]);

  const { isLoading } = useAppSelector(selectTabSlice);
  const { AID, BID, SID } = useAppSelector(selectLoginSessionSlice);

  const stopRef = useRef<boolean>(false);
  const endRef = useRef<any>();

  const moveChat = useMoveChatTab();

  const dispatch = useDispatch();
  const { history, currentWriteId } = useAppSelector(selectWriteHistorySlice);

  const submitSubject = async (inputParam?: WriteType) => {
    try {
      const assistantId = uuidv4();

      let input = '';
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
        addWriteHistory({ id: assistantId, input: subject, preProcessing: preProc, result: '' })
      );
      dispatch(setCurrentWrite(assistantId));

      dispatch(setLoadingTab(true));
      dispatch(
        activeToast({
          active: true,
          msg: '내용을 생성합니다. 10 크레딧이 차감되었습니다. (잔여 크레딧 :980)',
          isError: false
        })
      );

      const res = await fetch(CHAT_STREAM_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'X-PO-AI-MayFlower-Auth-SID': SID,
          'X-PO-AI-MayFlower-Auth-BID': BID,
          'X-PO-AI-MayFlower-Auth-AID': AID
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

      if (res.status !== 200) throw new Error('not 200 error');

      const reader = res.body?.getReader();
      var enc = new TextDecoder('utf-8');

      while (reader) {
        // if (isFull) break;
        const { value, done } = await reader.read();

        if (stopRef?.current) {
          dispatch(
            activeToast({
              active: true,
              msg: `작성 중지. 원하는 작업을 실행하세요.`,
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

        endRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }

      if (!stopRef.current) dispatch(setLoadingTab(false));
      dispatch(
        activeToast({
          active: true,
          msg: `작성 완료. 원하는 작업을 실행하세요.`,
          isError: false
        })
      );
    } catch (error) {
      dispatch(resetCurrentWrite());
      dispatch(
        activeToast({
          active: true,
          msg: `폴라리스 오피스 AI의 생성이 잘 되지 않았습니다.다시 시도해보세요.`,
          isError: true
        })
      );
    } finally {
      stopRef.current = false;
      dispatch(setLoadingTab(false));
    }
  };

  const currentWrite = history.filter((write) => write.id === currentWriteId)[0];
  const currentIndex = history.findIndex((write) => write.id === currentWriteId);
  return (
    <>
      {!currentWriteId ? (
        <Wrapper>
          <SubTitle subTitle="주제 작성하기" />

          <InputArea>
            <ExTextbox
              exampleList={exampleSubject}
              maxtTextLen={subjectMaxLength}
              value={subject}
              placeholder={'작성할 글의 주제를 입력하세요.'}
              setValue={(val: string) => {
                setSubject(val);
              }}></ExTextbox>
          </InputArea>

          <SubTitle subTitle="글 형식 정하기" />
          <RowStartBox>
            {firstRecList.map((form) => (
              <IconButton
                key={form.id}
                title={form.title}
                onClick={() => {
                  setSelectedForm(form);
                }}
                selected={selectedForm ? (selectedForm.id === form.id ? true : false) : false}
                icon={selectedForm.id === form.id ? form.selectedIcon : form.icon}
                cssExt={css`
                  margin-right: 8px;

                  & > div {
                    background-color: ${selectedForm && selectedForm.id === form.id
                      ? `var(--ai-purple-97-list-over)`
                      : 'var(--gray-gray-20)'};
                    margin-bottom: 8px;
                    width: 81px;
                    height: 48px;
                    padding: 0;
                  }
                `}></IconButton>
            ))}
          </RowStartBox>

          <SubTitle subTitle="작성 될 글자 수 선택하기 (공백포함)" />
          <RowStartBox>
            {lengthList.map((length, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedLength(length);
                }}
                selected={
                  selectedLength ? (selectedLength.length === length.length ? true : false) : false
                }
                cssExt={css`
                  border: ${selectedLength?.length === length.length
                    ? 'solid 1px var(--ai-purple-80-sub)'
                    : 'none'};
                  width: 82px;
                  background-color: ${selectedLength && selectedLength.length === length.length
                    ? `var(--ai-purple-97-list-over)`
                    : 'var(--gray-gray-20)'};
                  flex: none;
                  width: 82px;
                `}>
                {length.title}
              </Button>
            ))}
          </RowStartBox>

          <div>
            <Button
              disable={subject.length === 0}
              isCredit={true}
              cssExt={css`
                ${purpleBtnCss}
                width: 100%;
              `}
              onClick={() => {
                if (subject.length === 0) {
                  dispatch(
                    activeToast({ active: true, msg: '주제를 입력해주세요.', isError: true })
                  );
                  return;
                }

                submitSubject();
                dispatch(activeToast({ msg: '작성 시작', active: true, isError: false }));
              }}
              icon={icon_write}>
              글 작성하기
            </Button>
          </div>
        </Wrapper>
      ) : (
        <ResWrapper>
          <RowBox
            cssExt={css`
              margin-bottom: 8px;
            `}>
            <SubTitle subTitle="내용 미리보기" />
            {!isLoading && (
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
            {currentWrite.result.length === 0 ? (
              <LoadingWrapper>
                <Loading>작성한 주제로 폴라리스 오피스 AI가 멋진 내용을 만들어 드릴게요!</Loading>
              </LoadingWrapper>
            ) : (
              <ResultWrapper>
                <PreMarkdown text={currentWrite.result} endRef={endRef} />
              </ResultWrapper>
            )}
            {currentWrite.result.length > 0 && (
              <div>
                {/* {isLoading && (
                  <StopButton
                    cssExt={css`
                      margin: 0 auto;
                      margin-bottom: 16px;
                    `}
                    onClick={() => {
                      stopRef.current = true;
                    }}
                  />
                )} */}

                <>
                  <ColumDivider />
                  <RowBox
                    cssExt={css`
                      align-items: center;
                      color: var(--gray-gray-70);
                      font-size: 13px;
                      height: 35px;
                    `}>
                    <LengthWrapper>공백포함 {currentWrite?.result.length}자</LengthWrapper>
                    {!isLoading && (
                      <RightBox>
                        <Icon
                          cssExt={css`
                            width: 16px;
                            height: 16px;
                            padding: 6px 3px 6px 5px;
                            margin-right: 12px;
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
                            padding: 6px 3px 6px 5px;
                            margin-left: 12px;
                            opacity: ${currentIndex === history.length - 1 && '0.3'};
                          `}
                          iconSrc={icon_next}
                          onClick={() => {
                            if (currentIndex < history.length - 1) {
                              dispatch(setCurrentWrite(history[currentIndex + 1]?.id));
                            }
                          }}
                        />
                        <CopyIcon
                          cssExt={css`
                            margin-left: 12px;
                          `}
                          onClick={() => {
                            // TODO: 복사 로직

                            dispatch(
                              activeToast({
                                active: true,
                                msg: `내용 복사가 완료되었습니다.`,
                                isError: false
                              })
                            );
                          }}
                        />
                      </RightBox>
                    )}
                  </RowBox>
                </>
              </div>
            )}
          </ResultBox>
          {currentWrite?.result.length > 0 && !isLoading && (
            <>
              <RowBox>
                <Button
                  isCredit={true}
                  onClick={() => {
                    submitSubject(currentWrite);
                  }}>
                  다시 만들기
                </Button>
                <Button
                  cssExt={css`
                    margin-right: 0px;
                  `}
                  onClick={() => {
                    insertDoc(currentWrite.result);

                    dispatch(
                      activeToast({
                        active: true,
                        msg: `내용 삽입이 완료되었습니다.`,
                        isError: false
                      })
                    );
                  }}>
                  문서에 삽입하기
                </Button>
              </RowBox>
              <Button
                isCredit={true}
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
                채팅으로 더 많은 작업하기
              </Button>
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
