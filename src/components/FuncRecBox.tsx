import { useState, useEffect } from 'react';
import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import { RowBox } from '../views/AIChatTab';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  openRecFunc,
  closeRecFunc,
  initRecFunc,
  selectRecFunc,
  selectRecFuncSlice,
  selectSubRecFunc,
  recType,
  recBaseType
} from '../store/slices/recFuncSlice';
import icon_arrow_down from '../img/ico_arrow_down_small.svg';
import icon_arrow_up from '../img/ico_arrow_up_small.svg';
import icon_ai from '../img/ico_ai.svg';
import icon_prev from '../img/ico_arrow_prev.svg';
import Icon from './Icon';
import icon_sentence from '../img/aiChat/ico_sentence.svg';
import icon_table from '../img/aiChat/ico_table.svg';
import icon_list from '../img/aiChat/ico_table_of_contents.svg';
import icon_resume from '../img/aiChat/ico_ai_resume.svg';
import icon_spelingcheck from '../img/aiChat/ico_ai_spellingcheck.svg';
import icon_summary from '../img/aiChat/ico_ai_summary.svg';
import icon_translation from '../img/aiChat/ico_ai_translation.svg';
import icon_style from '../img/aiChat/ico_changing_style.svg';
import icon_sentence_purple from '../img/aiChat/ico_sentence_purple.svg';
import icon_table_purple from '../img/aiChat/ico_table_purple.svg';
import icon_list_purple from '../img/aiChat/ico_table_of_contents_purple.svg';
import icon_resume_purple from '../img/aiChat/ico_ai_resume_purple.svg';
import icon_spelingcheck_purple from '../img/aiChat/ico_ai_spellingcheck_purple.svg';
import icon_summary_purple from '../img/aiChat/ico_ai_summary_purple.svg';
import icon_translation_purple from '../img/aiChat/ico_ai_translation_purple.svg';
import icon_style_purple from '../img/aiChat/ico_changing_style_purple.svg';
import icon_new_chat from '../img/ico_newchat.svg';
import icon_new_chat_purple from '../img/ico_newchat_purple.svg';

import {
  justiCenter,
  flexColumn,
  justiSpaceBetween,
  flexWrap,
  alignItemCenter,
  grid3Btn,
  flex,
  grid
} from '../style/cssCommon';
import { useTranslation } from 'react-i18next';
import { flexShrink } from '../style/cssCommon';
import { flexGrow } from '../style/cssCommon';
import Button from './buttons/Button';
import IconTextButton from './buttons/IconTextButton';
import Grid from './layout/Grid';
import IconBoxTextButton from './buttons/IconBoxTextButton';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiCenter}
  
  width: 100%;
  border-radius: 0;
  box-sizing: border-box;

  background-color: rgba(245, 241, 253, 0.7);
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.3);
  border-radius: 10px 10px 0px 0px;
  padding: 14px 16px 14px 16px;
  border-top: solid 1px #fff;

  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  -ms-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);

  div {
    backdrop-filter: none;
  }
`;

export const RowWrapBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${flexWrap}
  ${justiSpaceBetween}
  ${alignItemCenter}

  width: 100%;
  ${({ cssExt }) => cssExt && cssExt}
`;

const OpenedBox = styled(RowWrapBox)`
  max-height: 138px;
  overflow-y: auto;
`;

const CommentWrapper = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}

  font-size: 13px;
  color: var(--gray-gray-90-01);
  box-sizing: border-box;
`;

const Grid3BtnContainer = styled.div`
  ${grid}
  ${grid3Btn}

  width: 100%;
  gap: 8px;
`;

interface FormListType {
  id: string;
  icon: string;
  title: string;
  selectedIcon: string;
  hasSubRec: boolean;
}

interface LengthListType {
  title: string;
  length: string;
}

export interface WriteOptions {
  input: string;
  form: FormListType;
  length: LengthListType;
}

export const DEFAULT_WRITE_OPTION_FORM_VALUE: FormListType = {
  id: 'paragraph',
  title: 'Sentence',
  icon: icon_sentence,
  selectedIcon: icon_sentence_purple,
  hasSubRec: false
};

export const formRecList = [
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  { id: 'list', title: 'List', icon: icon_list, selectedIcon: icon_list_purple, hasSubRec: false },
  {
    id: 'table',
    title: 'Table',
    icon: icon_table,
    selectedIcon: icon_table_purple,
    hasSubRec: false
  }
];

export const DEFAULT_WRITE_OPTION_LENGTH_VALUE: LengthListType = {
  title: 'Short',
  length: 'short'
};

export const lengthList = [
  DEFAULT_WRITE_OPTION_LENGTH_VALUE,
  { title: 'Medium', length: 'medium' },
  { title: 'Long', length: 'long' }
];

export interface ChatOptions {
  input: string;
}

export const REC_ID_LIST = {
  RESUME_WRITING: 'resume_writing',
  SUMMARY: 'summary',
  TRANSLATE: 'translate',
  CHANGE_TEXT_STYLE: 'change_text_style',
  MODIFY_TEXT: 'modify_text',
  START_NEW_CHATING: 'start_new_chating'
};

const recList = [
  {
    id: REC_ID_LIST.RESUME_WRITING,
    title: 'AddContent',
    icon: icon_resume,
    selectedIcon: icon_resume_purple,
    hasSubRec: false
  },
  {
    id: REC_ID_LIST.SUMMARY,
    title: 'Summary',
    icon: icon_summary,
    selectedIcon: icon_summary_purple,
    hasSubRec: false
  },
  {
    id: REC_ID_LIST.TRANSLATE,
    title: 'Translate',
    icon: icon_translation,
    selectedIcon: icon_translation_purple,
    hasSubRec: true
  },
  {
    id: REC_ID_LIST.CHANGE_TEXT_STYLE,
    title: 'ChangeStyle',
    icon: icon_style,
    selectedIcon: icon_style_purple,
    hasSubRec: true
  },
  {
    id: REC_ID_LIST.MODIFY_TEXT,
    title: 'Grammar',
    icon: icon_spelingcheck,
    selectedIcon: icon_spelingcheck_purple,
    hasSubRec: false
  },
  {
    id: REC_ID_LIST.START_NEW_CHATING,
    title: 'ChatReset',
    icon: icon_new_chat,
    selectedIcon: icon_new_chat_purple,
    hasSubRec: false
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
        id: 'french',
        title: 'French'
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
          line-height: 100%;
        `}>
        <Icon size="sm" iconSrc={icon_ai} />
        {comment}
      </RowBox>
      <Icon
        iconSrc={icon}
        size="sm"
        onClick={() => {
          onclick();
        }}
      />
    </CommentWrapper>
  );
};

const FucRecBox = ({ isFormRec }: { isFormRec: boolean }) => {
  const dispatch = useAppDispatch();
  const { selectedRecFunction, selectedSubRecFunction, isOpen } =
    useAppSelector(selectRecFuncSlice);
  const { t } = useTranslation();

  const [isSubPage, setIsSubPage] = useState<boolean>(false);

  const setSelectedFunc = (func: recType | null) => {
    dispatch(selectRecFunc(func));
  };

  const setSelectedSubFunc = (func: recBaseType | null) => {
    dispatch(selectSubRecFunc(func));
  };

  const resetAll = () => {
    dispatch(initRecFunc());
  };

  const recOpenComment = isFormRec ? t(`ChatingTab.UseVariableForm`) : t(`ChatingTab.UseMoreAI`);

  useEffect(() => {
    if (isFormRec) setSelectedFunc(formRecList[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormRec]);

  return (
    <Wrapper>
      {isOpen ? (
        <>
          <OpenedBox>
            <RowWrapBox
              cssExt={css`
                ${justiCenter}
                margin-bottom: 14px;
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
              {isFormRec ? (
                <Grid col={formRecList.length}>
                  {formRecList.map((rec) => (
                    <IconBoxTextButton
                      key={rec.id}
                      variant="white"
                      width="full"
                      height={48}
                      iconSize="md"
                      iconSrc={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
                      selected={selectedRecFunction ? selectedRecFunction.id === rec.id : false}
                      onClick={() => setSelectedFunc(rec)}>
                      {t(`FormList.${rec.title}`)}
                    </IconBoxTextButton>
                  ))}
                </Grid>
              ) : (
                !isSubPage && (
                  <RowWrapBox
                    cssExt={css`
                      gap: 8px;
                    `}>
                    {recList.map((rec) => (
                      <IconTextButton
                        width="full"
                        key={rec.id}
                        iconSrc={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
                        iconPos="left"
                        selected={rec.id === selectedRecFunction?.id}
                        onClick={() => {
                          if (selectedRecFunction?.id !== rec.id) setSelectedFunc(rec);
                          else if (selectedRecFunction?.id === rec.id) setSelectedFunc(null);

                          setSelectedSubFunc(null);

                          if (selectedRecFunction?.id !== rec.id && rec.hasSubRec) {
                            setIsSubPage(true);
                          }
                        }}
                        cssExt={css`
                          ${flex}
                          ${alignItemCenter}
                          ${rec.id !== REC_ID_LIST.START_NEW_CHATING && flexShrink}
                          ${rec.id !== REC_ID_LIST.START_NEW_CHATING && flexGrow}
                          flex: ${rec.id !== REC_ID_LIST.START_NEW_CHATING ? '30%' : 'none'};
                        `}>
                        {t(`ChatingTab.FuncRecBtn.${rec.title}`)}
                      </IconTextButton>
                    ))}
                  </RowWrapBox>
                )
              )}
            </RowWrapBox>
            {isSubPage && (
              <RowBox>
                <Button
                  width={26}
                  height={26}
                  variant="transparent"
                  onClick={() => {
                    setIsSubPage(false);
                    resetAll();
                  }}>
                  <Icon iconSrc={icon_prev} size="sm" />
                </Button>
                <Grid3BtnContainer>
                  {recSubList
                    .filter((sub) => sub.id === selectedRecFunction?.id)[0]
                    .subList.map((sub) => (
                      <Button
                        width="full"
                        key={sub.id}
                        selected={selectedSubRecFunction?.id === sub.id}
                        onClick={() => {
                          if (selectedSubRecFunction?.id !== sub.id) setSelectedSubFunc(sub);
                          else if (selectedSubRecFunction?.id === sub.id) setSelectedSubFunc(null);
                        }}>
                        {t(`ChatingTab.FuncRecBtn.SubFuncRec.${sub.title}`)}
                      </Button>
                    ))}
                </Grid3BtnContainer>
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
  );
};

export default FucRecBox;
