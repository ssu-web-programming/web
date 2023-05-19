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
import {
  justiCenter,
  flexColumn,
  justiSpaceBetween,
  flexWrap,
  alignItemCenter
} from '../../style/cssCommon';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  border-radius: 0;
  padding: 10px;
  ${flexColumn}

  /* background-color: transparent; */
  background-color: var(--ai-purple-99-bg-light);
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 10px 10px 0px 0px;

  ${justiCenter}
`;

export const RowWrapBox = styled.div<{ cssExt?: any }>`
  ${flexWrap}
  ${justiSpaceBetween}

  width: 100%;
  ${({ cssExt }) => cssExt && cssExt}
`;

const OpenedBox = styled(RowWrapBox)`
  max-height: 138px;
`;

const CommentWrapper = styled.div`
  ${justiCenter}
  ${alignItemCenter}

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
    title: 'Sentence',
    icon: icon_sentence,
    selectedIcon: icon_sentence_purple
  },
  { id: 'list', title: 'List', icon: icon_list, selectedIcon: icon_list_purple },
  { id: 'table', title: 'Table', icon: icon_table, selectedIcon: icon_table_purple }
];

export const REC_ID_LIST = {
  RESUME_WRITING: 'resume_writing',
  SUMMARY: 'summary',
  TRANSLATE: 'translate',
  CHANGE_TEXT_STYLE: 'change_text_style',
  MODIFY_TEXT: 'modify_text'
};

const recList = [
  {
    id: REC_ID_LIST.RESUME_WRITING,
    title: 'AddContent',
    icon: icon_resume,
    selectedIcon: icon_resume_purple
  },
  {
    id: REC_ID_LIST.SUMMARY,
    title: 'Summary',
    icon: icon_summary,
    selectedIcon: icon_summary_purple
  },
  {
    id: REC_ID_LIST.TRANSLATE,
    title: 'Translate',
    icon: icon_translation,
    selectedIcon: icon_translation_purple
  },
  {
    id: REC_ID_LIST.CHANGE_TEXT_STYLE,
    title: 'ChangeStyle',
    icon: icon_style,
    selectedIcon: icon_style_purple
  },
  {
    id: REC_ID_LIST.MODIFY_TEXT,
    title: 'Grammar',
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
        title: 'Korean'
      },
      {
        id: 'english',
        title: 'English'
      },
      {
        id: 'japanese',
        title: 'Japanese'
      },
      {
        id: 'chinese',
        title: 'Chinese'
      },
      {
        id: 'spanish',
        title: 'Spanish'
      },
      {
        id: 'indonesian',
        title: 'Indonesian'
      },
      {
        id: 'brazilian',
        title: 'Brazil'
      },
      {
        id: 'german',
        title: 'German'
      }
    ]
  },
  {
    id: 'change_text_style',
    subList: [
      {
        id: 'businessBody',
        title: 'BusinessStyle'
      },
      {
        id: 'friendly',
        title: 'Friendly'
      },
      {
        id: 'concisely',
        title: 'Simply'
      },
      {
        id: 'poetically',
        title: 'Poetically'
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
      <RowBox
        cssExt={css`
          ${justiCenter}
          width: fit-content;
        `}>
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
  const { t } = useTranslation();

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

  const recOpenComment =
    chatLength <= 1 ? t(`ChatingTab.TipList.UseVariableForm`) : t(`ChatingTab.TipList.UseMoreAI`);

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
                <RowWrapBox
                  cssExt={css`
                    ${justiCenter}
                  `}>
                  <CommentFlip
                    comment={recOpenComment}
                    icon={icon_arrow_down}
                    onclick={() => {
                      dispatch(closeRecFunc());
                    }}
                  />
                </RowWrapBox>
                <RowWrapBox>
                  {chatLength <= 1
                    ? firstRecList.map((rec) => (
                        <IconButton
                          title={t(`FormList.${rec.title}`)}
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
                            min-width: fit-content;
                          `}>
                          <Icon
                            iconSrc={
                              rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon
                            }
                            cssExt={css`
                              width: 12px;
                              height: 12px;
                              margin-right: 6px;
                            `}
                          />
                          <div>{t(`ChatingTab.FuncRecBtn.${rec.title}`)}</div>
                        </Button>
                      ))}
                </RowWrapBox>
                {isSubPage && (
                  <RowBox>
                    <Button
                      cssExt={css`
                        border: none;
                        background-color: transparent;
                        min-width: fit-content;
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
                              min-width: fit-content;
                            `}
                            selected={selectedSubRecFunction?.id === sub.id}
                            onClick={() => {
                              if (selectedSubRecFunction?.id !== sub.id) setSelectedSubFunc(sub);
                              else if (selectedSubRecFunction?.id === sub.id)
                                setSelectedSubFunc(null);
                            }}>
                            {t(`ChatingTab.FuncRecBtn.SubFuncRec.${sub.title}`)}
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
