import { useState } from 'react';
import Button from 'components/buttons/Button';
import IconBoxTextButton from 'components/buttons/IconBoxTextButton';
import IconTextButton from 'components/buttons/IconTextButton';
import ShowResultButton from 'components/buttons/ShowResultButton';
import {
  EngineVersion,
  formRecList,
  lengthList,
  WriteOptions
} from 'components/chat/RecommendBox/FormRec';
import ExTextbox from 'components/ExTextbox';
import Grid from 'components/layout/Grid';
import SubTitle from 'components/SubTitle';
import { ENGINE_VERSION_TO_CREDIT, VERSION_MAP } from 'constants/credit';
import { useTranslation } from 'react-i18next';
import { setCurrentWrite, WriteType } from 'store/slices/writeHistorySlice';
import { useAppDispatch } from 'store/store';
import { css } from 'styled-components';
import { getIconColor } from 'util/getColor';
import { exampleList, RowBox } from 'views/AIChatTab';

import icon_credit_outline from '../../../img/light/ico_credit_outline.svg';

import ModelSelect from './model-select';
import * as S from './style';

export type SelectedOption =
  | 'WRITE_GPT4_1'
  | 'WRITE_GPT4'
  | 'GPT3'
  | 'WRITE_CLOVA'
  | 'WRITE_CLADE3'
  | 'GPT5';

const subjectMaxLength = 1000;

const AIWriteInput = ({
  history,
  selectedOptions,
  setSelectedOptions,
  submitSubject
}: {
  history: WriteType[];
  selectedOptions: WriteOptions;
  setSelectedOptions: React.Dispatch<React.SetStateAction<WriteOptions>>;
  submitSubject: (inputParam?: WriteType) => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    input,
    form: selectedForm,
    length: selectedLength,
    version: { version }
  } = selectedOptions;
  const [modelSelectedOption, setModelSelectedOption] = useState(ENGINE_VERSION_TO_CREDIT[version]);
  const handleChangeOption = (value: SelectedOption) => {
    setSelectedOptions({
      ...selectedOptions,
      version: {
        ...selectedOptions.version,
        version: VERSION_MAP[value] as EngineVersion,
        id: VERSION_MAP[value] as EngineVersion
      }
    });
    setModelSelectedOption(value);
  };

  return (
    <S.WriteInputPage>
      <S.TitleInputSet>
        <RowBox>
          <SubTitle subTitle={t(`WriteTab.WriteTopic`)} />
          <ShowResultButton
            disable={history.length === 0}
            onClick={() => {
              const last = history[history.length - 1];
              if (last) dispatch(setCurrentWrite(last.id));
            }}
          />
        </RowBox>
        <S.InputArea>
          <ExTextbox
            exampleList={exampleList}
            maxTextLen={subjectMaxLength}
            value={input}
            placeholder={t(`WriteTab.WriteTextboxPlacehold`) || ''}
            setValue={(val: string) => {
              setSelectedOptions((prev) => ({ ...prev, input: val }));
            }}></ExTextbox>
        </S.InputArea>
      </S.TitleInputSet>
      <S.TitleInputSet>
        <SubTitle subTitle={t(`WriteTab.SelectVersion`)} />

        <ModelSelect selectedOption={modelSelectedOption} onChangeOption={handleChangeOption} />
      </S.TitleInputSet>
      <S.TitleInputSet>
        <SubTitle subTitle={t(`WriteTab.SelectForm`)} />
        <Grid col={formRecList.length}>
          {formRecList.map((form) => (
            <IconBoxTextButton
              key={form.id}
              variant="gray"
              width="full"
              height={48}
              iconSize="md"
              onClick={() => setSelectedOptions((prev) => ({ ...prev, form: form }))}
              selected={selectedForm ? (selectedForm.id === form.id ? true : false) : false}
              iconSrc={<form.icon color={getIconColor(form.id, selectedForm.id)} />}
              iconPos="top"
              innerText
              cssExt={css`
                height: 69px;
                border-radius: 8px;
              `}>
              <p
                style={{
                  lineHeight: '21px',
                  fontSize: 14,
                  paddingTop: '4px'
                }}>
                {t(`FormList.${form.id}`)}
              </p>
            </IconBoxTextButton>
          ))}
        </Grid>
      </S.TitleInputSet>
      <S.TitleInputSet>
        <SubTitle subTitle={t(`WriteTab.SelectResultLength`)} />
        <Grid col={3}>
          {lengthList.map((length, index) => (
            <Button
              width="full"
              variant="gray"
              key={index}
              onClick={() => setSelectedOptions((prev) => ({ ...prev, length: length }))}
              selected={
                selectedLength ? (selectedLength.length === length.length ? true : false) : false
              }
              cssExt={css`
                padding: 8px;
                line-height: 24px;
                font-size: 16px;
                height: 40px;
                border-radius: 8px;
              `}>
              {t(`WriteTab.Length.${length.id}`)}
            </Button>
          ))}
        </Grid>
      </S.TitleInputSet>

      <IconTextButton
        width="full"
        disable={input.length === 0}
        variant={input.length === 0 ? 'darkGray' : 'purple'}
        cssExt={css`
          padding-top: 4px;
          height: 48px;
          border-radius: 8px;
          font-size: 16px;
          line-height: 24px;
        `}
        onClick={() => submitSubject()}
        iconSrc={icon_credit_outline}
        iconPos="end"
        iconSize={18}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {t(`WriteTab.WritingArticle`)}
        </div>
      </IconTextButton>
    </S.WriteInputPage>
  );
};

export default AIWriteInput;
