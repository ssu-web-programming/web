//import useModal from '../../components/hooks/useModal';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import AskDocButton from '../../components/buttons/AskDocButton';
import CheckBox from '../../components/CheckBox';
import useLangParameterNavigate from '../../components/hooks/useLangParameterNavigate';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Footer, GuideMessage, Wrapper } from '../../style/askDoc';

type File = {
  fileId: string;
  fileRevision: number;
  fileName: string;
};

export type AskDocContext = {
  files: File[];
  data: any;
};

export const CheckDocHistory = () => {
  const { t } = useTranslation();
  // const { openModal, closeModal } = useModal();
  const { navigate } = useLangParameterNavigate();
  const { files, maxFileRevision, isLoading, isSuccsess, fileStatus, userId, isInitialized } =
    useAppSelector(filesSelector);
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleClick = () => {
    //선택한 문서를 다시 분석하는 경우
    if (isChecked) {
      console.log('files: ', files[0]);
      console.log('maxFileRevision: ', maxFileRevision);
      dispatch(
        setFiles({
          isLoading,
          isInitialized,
          isSuccsess,
          userId,
          fileStatus: null,
          files: [
            {
              ...files[0],
              fileRevision: maxFileRevision as number
            }
          ]
        })
      );

      return navigate('/AskDocStep/ConfirmDoc');
    } else {
      if (fileStatus === 'AVAILABLE') return navigate('/AskDocStep/Chat');
      if (fileStatus === 'TEXT_DONE') return navigate('/AskDocStep/StartAnalysisDoc');
      if (fileStatus === null) return navigate('/AskDocStep/ConfirmDoc');
      return navigate('/AskDocStep/ProgressAnalysisDoc');
    }
  };

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Wrapper background={false}>
      <Helmet>
        <title>CheckDocHistory</title>
      </Helmet>
      <GuideMessage>
        <h1>{t('AskDocStep.Step1.MainText')}</h1>
        <p>{t('AskDocStep.Step1.SubText')}</p>
      </GuideMessage>
      <List>
        {files.map((data) => {
          const fileExtArr = files[0].fileName.split('.');
          const fileExt = fileExtArr[fileExtArr.length - 1];
          const fileName = files[0].fileName.replace('.' + fileExt, '');

          return (
            <Item checked={isChecked} key={data.fileId}>
              <Logo
                src={`${process.env.REACT_APP_PO_API}/web/maxage1/common/img/v4/${fileExt}.svg`}
                alt="logo"
              />
              <Text>
                <span className={'name'}>{fileName}</span>
                <span className={'ext'}>{`.${fileExt}`}</span>
              </Text>
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} onClick={handleCheck} />
            </Item>
          );
        })}
      </List>
      <Footer>
        <AskDocButton
          onClick={handleClick}
          text={
            isChecked
              ? t('AskDocStep.Step1.ButtonTextChecked')
              : t('AskDocStep.Step1.ButtonTextUnChecked')
          }
          isActive={isChecked}
        />
      </Footer>
    </Wrapper>
  );
};

export default CheckDocHistory;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  width: 100%;
  height: 100%;
  padding: 40px 0 0 0;
`;

const Item = styled.li<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 8px;

  width: 100%;
  padding: 12px 24px;
  margin: 0;
  background-color: ${(props) => (props.checked ? '#ede5fe' : 'none')};
`;

const Logo = styled.img`
  width: 22px;
  height: 28px;
`;

const Text = styled.div`
  width: 80%;
  max-height: 21px;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  display: flex;
  flex-direction: row;

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
