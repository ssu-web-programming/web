import IconTextButton, { Chip } from 'components/buttons/IconTextButton';
import icon_credit_gray from 'img/ico_credit_gray.svg';
import { useTranslation } from 'react-i18next';
import { creditInfoSelector } from 'store/slices/creditInfo';
import styled, { css } from 'styled-components';
import { getIconColor } from 'util/getColor';

import icon_write from '../../img/ico_creating_text_white.svg';
import icon_credit_outline from '../../img/ico_credit_outline.svg';
import { setCurrentWrite, WriteType } from '../../store/slices/writeHistorySlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { flex, flexColumn } from '../../style/cssCommon';
import { exampleList, RowBox } from '../../views/AIChatTab';
import Button from '../buttons/Button';
import IconBoxTextButton from '../buttons/IconBoxTextButton';
import ShowResultButton from '../buttons/ShowResultButton';
import { formRecList, lengthList, versionList, WriteOptions } from '../chat/RecommendBox/FormRec';
import ExTextbox from '../ExTextbox';
import Icon from '../Icon';
import Grid from '../layout/Grid';
import { filterCreditInfo } from '../nova/Header';
import SubTitle from '../SubTitle';

const WriteInputPage = styled.div`
  ${flex}
  ${flexColumn}
  padding: 16px;
  width: 100%;
  height: 100%;
  gap: 16px;
`;

const InputArea = styled.div`
  ${flex}

  width: 100%;
`;

export const VersionInner = styled.div`
  display: flex;
  flex-direction: row;
`;

export const NewMark = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 2px;
  background-color: #fb4949;
`;

const TitleInputSet = styled.div`
  ${flex}
  ${flexColumn}
  gap: 8px;
`;

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
  const creditInfo = useAppSelector(creditInfoSelector);

  const CREDIT_NAME_MAP: { [key: string]: string } = {
    WRITE_GPT4O: 'GPT 4o',
    WRITE_GPT4: 'GPT 4',
    GPT3: 'GPT 3.5',
    WRITE_CLOVA: 'CLOVA X',
    WRITE_CLADE3: 'Claude 3.5 Sonnet'
  };

  const credit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP).reduce(
    (acc, cur) => {
      acc[CREDIT_NAME_MAP[cur.serviceType]] = cur;
      return acc;
    },
    {} as { [key: string]: any }
  );

  return (
    <WriteInputPage>
      <TitleInputSet>
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
        <InputArea>
          <ExTextbox
            exampleList={exampleList}
            maxTextLen={subjectMaxLength}
            value={input}
            placeholder={t(`WriteTab.WriteTextboxPlacehold`) || ''}
            setValue={(val: string) => {
              setSelectedOptions((prev) => ({ ...prev, input: val }));
            }}></ExTextbox>
        </InputArea>
      </TitleInputSet>
      <TitleInputSet>
        <SubTitle subTitle={t(`WriteTab.SelectVersion`)} />
        <Grid col={3}>
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
        </Grid>
        <Grid col={3}>
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
        </Grid>
      </TitleInputSet>
      <TitleInputSet>
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
      </TitleInputSet>
      <TitleInputSet>
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
      </TitleInputSet>

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
    </WriteInputPage>
  );
};

export default AIWriteInput;
