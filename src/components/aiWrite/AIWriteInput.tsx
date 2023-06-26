import styled, { css } from 'styled-components';
import { flex, flexColumn, flexGrow, flexShrink, purpleBtnCss } from '../../style/cssCommon';
import { RowBox, exampleList } from '../../views/AIChatTab';
import { useTranslation } from 'react-i18next';
import SubTitle from '../SubTitle';
import ShowResult from '../ShowResult';
import { useAppDispatch } from '../../store/store';
import { WriteType, setCurrentWrite } from '../../store/slices/writeHistorySlice';
import ExTextbox from '../ExTextbox';
import { Grid3BtnContainer } from '../../views/AIWriteTab';
import { WriteOptions, formRecList, lengthList } from '../FuncRecBox';
import IconButton from '../IconButton';
import NoBorderButton from '../NoBorderButton';
import Button from '../Button';
import icon_write from '../../img/ico_creating_text_white.svg';

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
  submitSubject: Function;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { input, form: selectedForm, length: selectedLength } = selectedOptions;

  return (
    <WriteInputPage>
      <TitleInputSet>
        <RowBox>
          <SubTitle subTitle={t(`WriteTab.WriteTopic`)} />
          <ShowResult
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
            maxtTextLen={subjectMaxLength}
            value={input}
            placeholder={t(`WriteTab.WriteTextboxPlacehold`) || ''}
            setValue={(val: string) => {
              setSelectedOptions((prev) => {
                return { ...prev, input: val };
              });
            }}></ExTextbox>
        </InputArea>
      </TitleInputSet>

      <TitleInputSet>
        <SubTitle subTitle={t(`WriteTab.SelectForm`)} />
        <Grid3BtnContainer>
          {formRecList.map((form) => (
            <div key={form.id}>
              <IconButton
                iconCssExt={css`
                  background-color: ${selectedForm.id === form.id
                    ? 'var(--ai-purple-97-list-over)'
                    : 'var(--gray-gray-20)'};
                  box-sizing: border-box;
                `}
                key={form.id}
                title={t(`FormList.${form.title}`)}
                onClick={() => {
                  setSelectedOptions((prev) => {
                    return { ...prev, form: form };
                  });
                }}
                selected={selectedForm ? (selectedForm.id === form.id ? true : false) : false}
                icon={selectedForm.id === form.id ? form.selectedIcon : form.icon}
              />
            </div>
          ))}
        </Grid3BtnContainer>
      </TitleInputSet>
      <TitleInputSet>
        <SubTitle subTitle={t(`WriteTab.SelectResultLength`)} />
        <Grid3BtnContainer>
          {lengthList.map((length, index) => (
            <NoBorderButton
              key={index}
              onClick={() => {
                setSelectedOptions((prev) => {
                  return { ...prev, length: length };
                });
              }}
              selected={
                selectedLength ? (selectedLength.length === length.length ? true : false) : false
              }
              cssExt={css`
                border: none;
                background-color: ${selectedLength && selectedLength.length === length.length
                  ? `var(--ai-purple-97-list-over)`
                  : 'var(--gray-gray-20)'};
                flex: none;
                font-size: 13px;
                font-weight: ${selectedLength?.length === length.length ? 'border' : 'none'};
                font-stretch: normal;
                font-style: normal;
                line-height: 1.54;
                letter-spacing: normal;

                box-sizing: border-box;

                width: 100%;
                padding: 4px 0px;
              `}>
              {t(`WriteTab.Length.${length.title}`)}
            </NoBorderButton>
          ))}
        </Grid3BtnContainer>
      </TitleInputSet>

      <div>
        <Button
          disable={input.length === 0}
          isCredit={true}
          cssExt={css`
            ${purpleBtnCss}
            width: 100%;
            margin-top: 4px;
          `}
          onClick={() => {
            if (input.length === 0) {
              return;
            }

            submitSubject();
          }}
          icon={icon_write}>
          {t(`WriteTab.WritingArticle`)}
        </Button>
      </div>
    </WriteInputPage>
  );
};

export default AIWriteInput;
