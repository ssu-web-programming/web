import styled from 'styled-components';
import { flex, flexColumn } from '../../style/cssCommon';
import { RowBox, exampleList } from '../../views/AIChatTab';
import { useTranslation } from 'react-i18next';
import SubTitle from '../SubTitle';
import ShowResultButton from '../buttons/ShowResultButton';
import { useAppDispatch } from '../../store/store';
import { WriteType, setCurrentWrite } from '../../store/slices/writeHistorySlice';
import ExTextbox from '../ExTextbox';
import { WriteOptions, formRecList, lengthList } from '../chat/RecommendBox/FormRec';
import icon_write from '../../img/ico_creating_text_white.svg';
import CreditButton from '../buttons/CreditButton';
import Icon from '../Icon';
import Button from '../buttons/Button';
import IconBoxTextButton from '../buttons/IconBoxTextButton';
import Grid from '../layout/Grid';

const WriteInputPage = styled.div`
  ${flex}
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
  const { input, form: selectedForm, length: selectedLength } = selectedOptions;

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
              iconSrc={selectedForm.id === form.id ? form.selectedIcon : form.icon}>
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

      <div style={{ paddingTop: '4px' }}>
        <CreditButton
          width="full"
          disable={input.length === 0}
          variant="purpleGradient"
          onClick={() => submitSubject()}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Icon size="sm" iconSrc={icon_write}></Icon>
            {t(`WriteTab.WritingArticle`)}
          </div>
        </CreditButton>
      </div>
    </WriteInputPage>
  );
};

export default AIWriteInput;
