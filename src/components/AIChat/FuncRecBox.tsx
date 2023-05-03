import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { RowBox } from '../../views/AIChatTab';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  openRecFunc,
  closeRecFunc,
  initRecFunc,
  selectRecFunc,
  selectRecFuncSlice,
  selectSubRecFunc
} from '../../store/slices/recFuncSlice';

const Wrapper = styled.div`
  background-color: lightgray;
  border-radius: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export const RowWrapBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

export interface recType {
  id: string;
  title: string;
}

const firstRecList = [
  {
    id: 'sentence',
    title: '문장'
  },
  { id: 'list', title: '목록' },
  { id: 'table', title: '표' }
];

const recList = [
  {
    id: 'continueWriting',
    title: '이어쓰기'
  },
  {
    id: 'summarize',
    title: '요약하기'
  },
  {
    id: 'translate',
    title: '번역하기'
  },
  {
    id: 'changeWritingStyle',
    title: '문체 변경하기'
  },
  {
    id: 'editGrammar',
    title: '맞춤법/문법 수정하기'
  }
];

export const recSubList = [
  {
    id: 'translate',
    subList: [
      {
        id: 'korean',
        title: '한국어'
      },
      {
        id: 'english',
        title: '영어'
      },
      {
        id: 'japanese',
        title: '일본어'
      },
      {
        id: 'chinese',
        title: '중국어'
      },
      {
        id: 'spanish',
        title: '스페인어'
      },
      {
        id: 'indonesian',
        title: '인도네시아어'
      },
      {
        id: 'brazilian',
        title: '브라질어'
      },
      {
        id: 'german',
        title: '독일어'
      }
    ]
  },
  {
    id: 'changeWritingStyle',
    subList: [
      {
        id: 'businessStyle',
        title: '비즈니스체'
      },
      {
        id: 'friendly',
        title: '친근하게'
      },
      {
        id: 'concisely',
        title: '간결하게'
      },
      {
        id: 'poetically',
        title: '시적으로'
      }
    ]
  }
];

const FucRecBox = ({ chatLength }: { chatLength: number }) => {
  const dispatch = useAppDispatch();
  const { selectedRecFunction, selectedSubRecFunction, isOpen, isActive } =
    useAppSelector(selectRecFuncSlice);

  const [isSubPage, setIsSubPage] = useState<boolean>(false);

  const setSelectedFunc = (func: recType | null) => {
    dispatch(selectRecFunc(func));
  };

  const setSelectedSubFunc = (func: recType | null) => {
    dispatch(selectSubRecFunc(func));
  };

  const resetAll = () => {
    dispatch(initRecFunc());
  };

  const recClosedComment =
    chatLength <= 1 ? '다양한 형식으로 답변을 작성해보세요' : '더 많은 AI 기능을 사용해보세요.';
  const recOpenComment = '더 많은 텍스트를 만들어보세요';

  useEffect(() => {
    if (chatLength <= 1) setSelectedFunc(firstRecList[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isActive && (
        <Wrapper>
          {isOpen ? (
            <>
              <RowWrapBox>
                <RowWrapBox>
                  <div>{recOpenComment}</div>
                  <Button
                    onClick={() => {
                      dispatch(closeRecFunc());
                    }}>
                    닫기
                  </Button>
                </RowWrapBox>
                {chatLength <= 1
                  ? firstRecList.map((rec) => (
                      <Button
                        key={rec.id}
                        selected={rec.id === selectedRecFunction?.id}
                        onClick={() => {
                          setSelectedFunc(rec);
                        }}>
                        {rec.title}
                      </Button>
                    ))
                  : !isSubPage &&
                    recList.map((rec) => (
                      <Button
                        key={rec.id}
                        selected={rec.id === selectedRecFunction?.id}
                        onClick={() => {
                          if (selectedRecFunction?.id !== rec.id) setSelectedFunc(rec);
                          else if (selectedRecFunction?.id === rec.id) setSelectedFunc(null);

                          if (
                            selectedRecFunction?.id !== rec.id &&
                            recSubList.filter((sub) => sub.id === rec.id).length > 0
                          ) {
                            setIsSubPage(true);
                          } else {
                            dispatch(selectSubRecFunc(null));
                          }
                        }}>
                        {rec.title}
                      </Button>
                    ))}
                {isSubPage && (
                  <RowBox>
                    <Button
                      onClick={() => {
                        setIsSubPage(false);
                        resetAll();
                      }}>
                      {'<'}
                    </Button>
                    <RowWrapBox>
                      {recSubList
                        .filter((sub) => sub.id === selectedRecFunction?.id)[0]
                        .subList.map((sub) => (
                          <Button
                            selected={selectedSubRecFunction?.id === sub.id}
                            onClick={() => {
                              if (selectedSubRecFunction?.id !== sub.id) setSelectedSubFunc(sub);
                              else if (selectedSubRecFunction?.id === sub.id)
                                setSelectedSubFunc(null);
                            }}>
                            {sub.title}
                          </Button>
                        ))}
                    </RowWrapBox>
                  </RowBox>
                )}
              </RowWrapBox>
            </>
          ) : (
            <>
              <RowWrapBox>
                <div>{recClosedComment}</div>
                <Button
                  onClick={() => {
                    dispatch(openRecFunc());
                  }}>
                  열기
                </Button>
              </RowWrapBox>
            </>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default FucRecBox;
