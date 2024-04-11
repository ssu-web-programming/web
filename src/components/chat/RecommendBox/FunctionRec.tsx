import { useTranslation } from 'react-i18next';
import { recType, selectRecFuncSlice } from '../../../store/slices/recFuncSlice';
import { useAppSelector } from '../../../store/store';
import { RowWrapBox } from './ChatRecommend';
import styled, { css } from 'styled-components';
import icon_resume from '../../../img/aiChat/ico_ai_resume.svg';
import icon_spelingcheck from '../../../img/aiChat/ico_ai_spellingcheck.svg';
import icon_summary from '../../../img/aiChat/ico_ai_summary.svg';
import icon_translation from '../../../img/aiChat/ico_ai_translation.svg';
import icon_style from '../../../img/aiChat/ico_changing_style.svg';
import icon_resume_purple from '../../../img/aiChat/ico_ai_resume_purple.svg';
import icon_spelingcheck_purple from '../../../img/aiChat/ico_ai_spellingcheck_purple.svg';
import icon_summary_purple from '../../../img/aiChat/ico_ai_summary_purple.svg';
import icon_translation_purple from '../../../img/aiChat/ico_ai_translation_purple.svg';
import icon_style_purple from '../../../img/aiChat/ico_changing_style_purple.svg';
import icon_new_chat from '../../../img/ico_newchat.svg';
import icon_new_chat_purple from '../../../img/ico_newchat_purple.svg';
import IconTextButton from '../../buttons/IconTextButton';
import { RowBox } from '../../../views/AIChatTab';
import Button from '../../buttons/Button';
import icon_prev from '../../../img/ico_arrow_prev.svg';
import Icon from '../../Icon';
import Grid from '../../layout/Grid';

export const REC_ID_LIST = {
  RESUME_WRITING: 'resume_writing',
  SUMMARY: 'summary',
  TRANSLATE: 'translate',
  CHANGE_TEXT_STYLE: 'change_text_style',
  MODIFY_TEXT: 'modify_text',
  START_NEW_CHATING: 'start_new_chating'
};

const recList = [
  [
    {
      id: REC_ID_LIST.RESUME_WRITING,
      icon: icon_resume,
      selectedIcon: icon_resume_purple,
      subList: null
    },
    {
      id: REC_ID_LIST.SUMMARY,
      icon: icon_summary,
      selectedIcon: icon_summary_purple,
      subList: null
    },
    {
      id: REC_ID_LIST.TRANSLATE,
      icon: icon_translation,
      selectedIcon: icon_translation_purple,
      subList: [
        'Korean',
        'English',
        'Japanese',
        'Chinese',
        'Spanish',
        'French',
        'Indonesian',
        'Brazil',
        'German'
      ]
    }
  ],
  [
    {
      id: REC_ID_LIST.CHANGE_TEXT_STYLE,
      icon: icon_style,
      selectedIcon: icon_style_purple,
      subList: ['BusinessStyle', 'Friendly', 'Simply', 'Poetically']
    },
    {
      id: REC_ID_LIST.MODIFY_TEXT,
      icon: icon_spelingcheck,
      selectedIcon: icon_spelingcheck_purple,
      subList: null
    }
  ],
  [
    {
      id: REC_ID_LIST.START_NEW_CHATING,
      icon: icon_new_chat,
      selectedIcon: icon_new_chat_purple,
      subList: null
    }
  ]
];

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ButtonText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FunctionRec = ({
  onClick,
  onSubClick,
  onClickBack = () => {},
  isSubPage
}: {
  onClick: (rec: recType) => void;
  onSubClick: (sub: string) => void;
  onClickBack: () => void;
  isSubPage: boolean;
}) => {
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);
  const { t } = useTranslation();

  if (!isSubPage)
    return (
      <RowWrapBox
        cssExt={css`
          gap: 8px;
        `}>
        {recList.map((group, index) => {
          return (
            <ButtonGroup key={index}>
              {group.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    width: `${100 / group.length}%`,
                    overflow: 'hidden'
                  }}>
                  <IconTextButton
                    width="full"
                    key={rec.id}
                    iconSrc={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
                    iconPos="left"
                    selected={rec.id === selectedRecFunction?.id}
                    onClick={() => onClick(rec)}>
                    <ButtonText>{t(`ChatingTab.FuncRecBtn.${rec.id}`)}</ButtonText>
                  </IconTextButton>
                </div>
              ))}
            </ButtonGroup>
          );
        })}
      </RowWrapBox>
    );
  else
    return (
      <RowBox>
        <Button width={26} height={26} variant="transparent" onClick={onClickBack}>
          <Icon iconSrc={icon_prev} size="sm" />
        </Button>
        <Grid col={3}>
          {selectedRecFunction?.subList?.map((sub) => (
            <Button
              width="full"
              key={sub}
              selected={selectedSubRecFunction?.id === sub}
              onClick={() => onSubClick(sub)}>
              <ButtonText>{t(`ChatingTab.FuncRecBtn.SubFuncRec.${sub}`)}</ButtonText>
            </Button>
          ))}
        </Grid>
      </RowBox>
    );
};

export default FunctionRec;
