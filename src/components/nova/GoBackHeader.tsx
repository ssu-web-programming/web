import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ArrowLeftIcon from '../../img/ico_arrow_left.svg';
import { setPageData, setPageResult, setPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../store/store';

const Header = styled.div`
  width: 100%;
  height: 48px;
  position: fixed;
  padding: 12px 16px;
`;

const Wrap = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  cursor: pointer;

  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #454c53;
  }
`;

const ImageWrap = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function GoBackHeader() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const handleGoBack = () => {
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
    dispatch(setPageData({ tab: selectedNovaTab, data: null }));
    dispatch(setPageResult({ tab: selectedNovaTab, result: null }));
  };

  return (
    <Header>
      <Wrap onClick={handleGoBack}>
        <ImageWrap>
          <img src={ArrowLeftIcon} alt="arrow" />
        </ImageWrap>
        <span>{t(`Nova.GoBackHeader`)}</span>
      </Wrap>
    </Header>
  );
}
