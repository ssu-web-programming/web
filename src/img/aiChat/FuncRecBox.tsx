import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Button from '../../components/Button';
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
import icon_arrow_down from '../../img/ico_arrow_down_small.svg';
import icon_arrow_up from '../../img/ico_arrow_up_small.svg';
import icon_ai from '../../img/ico_ai.svg';
import icon_prev from '../../img/ico_arrow_prev.svg';
import Icon from '../../components/Icon';
import IconButton from '../../components/IconButton';

import icon_sentence from '../../img/aiChat/ico_sentence.svg';
import icon_table from '../../img/aiChat/ico_table.svg';
import icon_list from '../../img/aiChat/ico_table_of_contents.svg';
import icon_resume from '../../img/aiChat/ico_ai_resume.svg';
import icon_spelingcheck from '../../img/aiChat/ico_ai_spellingcheck.svg';
import icon_summary from '../../img/aiChat/ico_ai_summary.svg';
import icon_translation from '../../img/aiChat/ico_ai_translation.svg';
import icon_style from '../../img/aiChat/ico_changing_style.svg';

import icon_sentence_purple from '../../img/aiChat/ico_sentence_purple.svg';
import icon_table_purple from '../../img/aiChat/ico_table_purple.svg';
import icon_list_purple from '../../img/aiChat/ico_table_of_contents_purple.svg';
import icon_resume_purple from '../../img/aiChat/ico_ai_resume_purple.svg';
import icon_spelingcheck_purple from '../../img/aiChat/ico_ai_spellingcheck_purple.svg';
import icon_summary_purple from '../../img/aiChat/ico_ai_summary_purple.svg';
import icon_translation_purple from '../../img/aiChat/ico_ai_translation_purple.svg';
import icon_style_purple from '../../img/aiChat/ico_changing_style_purple.svg';

const Wrapper = styled.div`
  background-color: lightgray;
  border-radius: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: var(--ai-purple-99-bg-light);
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
  border-radius: 10px 10px 0px 0px;

  justify-content: center;
`;

export const RowWrapBox = styled.div<{ cssExt?: any }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  ${({ cssExt }) => cssExt && cssExt}
`;

const OpenedBox = styled(RowWrapBox)`
  max-height: 138px;
`;

const CommentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  /* margin: 8px; */
  font-size: 13px;
  color: var(--gray-gray-90-01);
  margin-bottom: 3px;
`;

export interface recType {
  id: string;
  title: string;
  icon?: string;
}

export const firstRecList = [
  {
    id: 'paragraph',
    title: '문장',
    icon: icon_sentence,
    selectedIcon: icon_sentence_purple
  },
  { id: 'list', title: '목차', icon: icon_list, selectedIcon: icon_list_purple },
  { id: 'table', title: '표', icon: icon_table, selectedIcon: icon_table_purple }
];

const recList = [
  {
    id: 'resume_writing',
    title: '이어쓰기',
    icon: icon_resume,
    selectedIcon: icon_resume_purple
  },
  {
    id: 'summary',
    title: '요약하기',
    icon: icon_summary,
    selectedIcon: icon_summary_purple
  },
  {
    id: 'translate',
    title: '번역하기',
    icon: icon_translation,
    selectedIcon: icon_translation_purple
  },
  {
    id: 'change_text_style',
    title: '문체 변경하기',
    icon: icon_style,
    selectedIcon: icon_style_purple
  },
  {
    id: 'modify_text',
    title: '맞춤법/문법 수정하기',
    icon: icon_spelingcheck,
    selectedIcon: icon_spelingcheck_purple
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
    id: 'change_text_style',
    subList: [
      {
        id: 'businessBody',
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

const CommentFlip = ({
  comment,
  onclick,
  icon
}: {
  comment: string;
  onclick: Function;
  icon: string;
}) => {
  return (
    <CommentWrapper>
      <RowBox>
        <Icon
          cssExt={css`
            width: 16px;
            height: 20px;
            margin: 0 6px 0 0;
          `}
          iconSrc={icon_ai}
        />
        {comment}
      </RowBox>
      <Icon
        iconSrc={icon}
        cssExt={css`
          width: 16px;
          height: 16px;
          margin: 2px 0 2px 4px;
        `}
        onClick={() => {
          onclick();
        }}
      />
    </CommentWrapper>
  );
};

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
              <OpenedBox>
                <RowWrapBox>
                  <CommentFlip
                    comment={recOpenComment}
                    icon={icon_arrow_down}
                    onclick={() => {
                      dispatch(closeRecFunc());
                    }}
                  />
                </RowWrapBox>
                {chatLength <= 1
                  ? firstRecList.map((rec) => (
                      <IconButton
                        title={rec.title}
                        key={rec.id}
                        onClick={() => {
                          setSelectedFunc(rec);
                        }}
                        selected={selectedRecFunction ? selectedRecFunction.id === rec.id : false}
                        icon={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
                      />
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
                        }}
                        cssExt={css`
                          border: ${rec.id === selectedRecFunction?.id
                            ? 'solid 1px var(--ai-purple-80-sub)'
                            : 'none'};
                          margin: 3px;
                          height: fit-content;
                        `}>
                        <Icon
                          iconSrc={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
                          cssExt={css`
                            width: 12px;
                            height: 12px;
                            margin-right: 6px;
                          `}
                        />
                        <div>{rec.title}</div>
                      </Button>
                    ))}
                {isSubPage && (
                  <RowBox>
                    <Button
                      cssExt={css`
                        border: none;
                        background-color: transparent;
                      `}
                      onClick={() => {
                        setIsSubPage(false);
                        resetAll();
                      }}>
                      <Icon
                        iconSrc={icon_prev}
                        cssExt={css`
                          width: 16px;
                          height: 16px;
                          padding: 5px 3px 5px 1px;
                        `}
                      />
                    </Button>
                    <RowWrapBox>
                      {recSubList
                        .filter((sub) => sub.id === selectedRecFunction?.id)[0]
                        .subList.map((sub) => (
                          <Button
                            cssExt={css`
                              border: ${selectedSubRecFunction?.id === sub.id
                                ? 'solid 1px var(--ai-purple-80-sub)'
                                : 'none'};
                              margin: 3px;
                              height: fit-content;
                            `}
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
              </OpenedBox>
            </>
          ) : (
            <CommentFlip
              comment={recOpenComment}
              icon={icon_arrow_up}
              onclick={() => {
                dispatch(openRecFunc());
              }}
            />
          )}
        </Wrapper>
      )}
    </>
  );
};

export default FucRecBox;
