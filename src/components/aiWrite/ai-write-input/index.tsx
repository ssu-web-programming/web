import { ReactNode, useState } from 'react';
import Button from 'components/buttons/Button';
import IconBoxTextButton from 'components/buttons/IconBoxTextButton';
import IconTextButton, { Chip } from 'components/buttons/IconTextButton';
import ShowResultButton from 'components/buttons/ShowResultButton';
import { formRecList, lengthList, WriteOptions } from 'components/chat/RecommendBox/FormRec';
import ExTextbox from 'components/ExTextbox';
import Icon from 'components/Icon';
import Grid from 'components/layout/Grid';
import { filterCreditInfo } from 'components/nova/Header';
import Select, { SelectOption } from 'components/select';
import SubTitle from 'components/SubTitle';
import { CREDIT_DESCRITION_MAP, CREDIT_NAME_MAP } from 'constants/credit';
import icon_credit_gray from 'img/ico_credit_gray.svg';
import { useTranslation } from 'react-i18next';
import { creditInfoSelector } from 'store/slices/creditInfo';
import { setCurrentWrite, WriteType } from 'store/slices/writeHistorySlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import { getIconColor } from 'util/getColor';
import { exampleList, RowBox } from 'views/AIChatTab';

import icon_write from '../../../img/ico_creating_text_white.svg';
import icon_credit_outline from '../../../img/ico_credit_outline.svg';

import ModelSelect from './model-select';
import * as S from './style';

type SelectedOption = 'WRITE_GPT4O' | 'WRITE_GPT4' | 'GPT3' | 'WRITE_CLOVA' | 'WRITE_CLADE3';

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
    version: selectedVersion,
    form: selectedForm,
    length: selectedLength
  } = selectedOptions;
  const [selectedOption, setSelectedOption] = useState<SelectedOption>('WRITE_GPT4O');
  const creditInfo = useAppSelector(creditInfoSelector);

  const credit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP).reduce(
    (acc, cur) => {
      acc[CREDIT_NAME_MAP[cur.serviceType]] = cur;
      return acc;
    },
    {} as { [key: string]: any }
  );

  const convertedCredit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP).map((el) => ({
    ...el,
    title: CREDIT_NAME_MAP[el.serviceType],
    desc: CREDIT_DESCRITION_MAP[el.serviceType]
  }));

  const handleChangeOption = (value: any) => {
    setSelectedOption(value);
  };

  console.log('convertedCredit', convertedCredit);

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
        {/* 호진FIXME: 다국어 관련 작업 진행 예정 */}
        <SubTitle subTitle={t(`WriteTab.SelectVersion`)} />

        <ModelSelect selectedOption={selectedOption} onChangeOption={handleChangeOption} />
        {/* <Grid col={3}>
          {versionList.slice(0, 3).map((cur) => (
            <IconTextButton
              width="full"
              variant="gray"
              key={cur.version}
              cssExt={css`
                padding: 4px 12px;

                > div {
                  justify-content: space-between;
                }
              `}
              onClick={() => setSelectedOptions((prev) => ({ ...prev, version: cur }))}
              selected={selectedVersion.version === cur.version}
              iconSrc={
                <Chip iconSrc={icon_credit_gray}>
                  <span>{credit[cur.id]?.deductCredit}</span>
                </Chip>
              }
              iconPos="end">
              <VersionInner>
                {cur.id}
                {cur.id === 'GPT 4o' && <NewMark></NewMark>}
              </VersionInner>
            </IconTextButton>
          ))}
        </Grid> */}
        {/* <Grid col={3}>
          {versionList.slice(3, 5).map((cur) => (
            <IconTextButton
              width="full"
              variant="gray"
              key={cur.version}
              cssExt={css`
                padding: 4px 12px;
                grid-column: ${cur.id === 'Claude 3.5 Sonnet' ? '2 / 4' : '1 / 2'};

                > div {
                  justify-content: space-between;
                }
              `}
              onClick={() => setSelectedOptions((prev) => ({ ...prev, version: cur }))}
              selected={selectedVersion.version === cur.version}
              iconSrc={
                <Chip iconSrc={icon_credit_gray}>
                  <span>{credit[cur.id]?.deductCredit}</span>
                </Chip>
              }
              iconPos="end">
              <VersionInner>
                {cur.id}
                {cur.id === 'Claude 3.5 Sonnet' && <NewMark></NewMark>}
              </VersionInner>
            </IconTextButton>
          ))}
        </Grid> */}
      </S.TitleInputSet>
      <S.TitleInputSet>
        {/* 호진FIXME: 다국어 관련 작업 진행 예정 */}
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
              iconSrc={<form.icon color={getIconColor(form.id, selectedForm.id)} />}>
              {t(`FormList.${form.id}`)}
            </IconBoxTextButton>
          ))}
        </Grid>
      </S.TitleInputSet>
      <S.TitleInputSet>
        {/* 호진FIXME: 다국어 관련 작업 진행 예정 */}
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
              }>
              {t(`WriteTab.Length.${length.id}`)}
            </Button>
          ))}
        </Grid>
      </S.TitleInputSet>

      <IconTextButton
        width="full"
        disable={input.length === 0}
        variant="purpleGradient"
        cssExt={css`
          padding-top: 4px;
          height: 40px;
        `}
        onClick={() => submitSubject()}
        iconSrc={icon_credit_outline}
        iconPos="end"
        iconSize={18}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Icon size="sm" iconSrc={icon_write}></Icon>
          {t(`WriteTab.WritingArticle`)}
        </div>
      </IconTextButton>
    </S.WriteInputPage>
  );
};

export default AIWriteInput;
