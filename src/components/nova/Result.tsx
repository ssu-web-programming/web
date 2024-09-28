import React, { useEffect, useState } from 'react';
import DownloadIcon from 'img/ico_download_white.svg';
import InsertDocsIcon from 'img/ico_insert_docs.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CreditColorIcon from '../../img/ico_credit_color_outline.svg';
import CheckIcon from '../../img/nova/check_purple.png';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { ClientType, getPlatform } from '../../util/bridge';
import { base64ToBlob } from '../../util/files';
import { useChangeBackground } from '../hooks/nova/useChangeBackground';
import { useInsertDocsHandler } from '../hooks/nova/useInsertDocsHandler';
import { useRemakeImage } from '../hooks/nova/useRemakeImage';

import GoBackHeader from './GoBackHeader';
import { ClientStatusType } from '../../pages/Nova/Nova';

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 16px;
  margin-bottom: 24px;
`;

const Guide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

const Title = styled.div`
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  span {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: #26282b;
    text-align: center;
    white-space: break-spaces;
  }
`;

const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #454c53;
  text-align: center;
  white-space: break-spaces;
`;

const ImageBox = styled.div<{ isBordered: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 100%;
  border: ${(props) => (props.isBordered ? '1px solid #c9cdd2' : 'none')};
  border-radius: 8px;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const RemakeButton = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  cursor: pointer;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #454c53;
  }

  img {
    position: absolute;
    right: 12px;
  }
`;

const DefaultButtonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const InsertDocButton = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 0;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

const SaveButton = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 0;
  background: #6f3ad0;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

export default function Result() {
  const platform = getPlatform();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { insertDocsHandler } = useInsertDocsHandler();
  const { handleChangeBackground } = useChangeBackground();
  const { handleRemakeImage } = useRemakeImage();
  const [showInsertDocBtn, setShowInsertDocBtn] = useState(true);

  useEffect(() => {
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        if (status === 'home' && platform !== ClientType.android && platform !== ClientType.ios) {
          setShowInsertDocBtn(false);
        } else {
          setShowInsertDocBtn(true);
        }
      }
    });
  }, []);

  const OnSave = async () => {
    if (result) {
      const blob = base64ToBlob(result.data, result.contentType);
      Bridge.callBridgeApi('downloadImage', blob);
      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.SaveCompleted`) }));
    } else {
      dispatch(activeToast({ type: 'error', msg: 'ToastMsg.SaveFailed' }));
    }
  };

  const handleRemake = async () => {
    switch (selectedNovaTab) {
      case NOVA_TAB_TYPE.changeBG:
        await handleChangeBackground(result?.info);
        break;
      case NOVA_TAB_TYPE.remakeImg:
        await handleRemakeImage();
    }
  };

  return (
    <Wrap>
      <GoBackHeader />
      <Body>
        <Guide>
          <Title>
            <img src={CheckIcon} alt="check" />
            <span>{t(`Nova.${selectedNovaTab}.Done.Title`)}</span>
          </Title>
          <SubTitle>{t(`Nova.${selectedNovaTab}.Done.SubTitle`)}</SubTitle>
        </Guide>
        <ImageBox isBordered={selectedNovaTab === NOVA_TAB_TYPE.removeBG}>
          <div>
            <img src={`data:${result?.contentType};base64,${result?.data}`} alt="result" />
          </div>
        </ImageBox>
        <ButtonWrap>
          {(selectedNovaTab === NOVA_TAB_TYPE.changeBG ||
            selectedNovaTab === NOVA_TAB_TYPE.remakeImg) && (
            <RemakeButton onClick={handleRemake}>
              <span>{t(`Nova.Result.Remake`)}</span>
              <img src={CreditColorIcon} alt="credit" />
            </RemakeButton>
          )}
          <DefaultButtonWrap>
            {showInsertDocBtn && (
              <InsertDocButton onClick={() => insertDocsHandler()}>
                <img src={InsertDocsIcon} alt="docs" />
                <span>{t(`Nova.Result.InsertDoc`)}</span>
              </InsertDocButton>
            )}
            <SaveButton onClick={OnSave}>
              <img src={DownloadIcon} alt="download" />
              <span>{t(`Nova.Result.Save`)}</span>
            </SaveButton>
          </DefaultButtonWrap>
        </ButtonWrap>
      </Body>
    </Wrap>
  );
}
