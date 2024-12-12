import { useEffect, useState } from 'react';
import DownloadIcon from 'img/light/ico_download_white.svg';
import InsertDocsIcon from 'img/light/ico_insert_docs.svg';
import { lang } from 'locale';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { setOnlineStatus } from 'store/slices/network';
import styled from 'styled-components';

import CreditColorIcon from '../../img/light/ico_credit_color_outline.svg';
import CheckIcon from '../../img/light/nova/check_purple.svg';
import { ClientStatusType } from '../../pages/Nova/Nova';
import {
  resetPageData,
  resetPageResult,
  selectPageResult,
  setPageStatus
} from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { activeToast } from '../../store/slices/toastSlice';
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { ClientType, getPlatform } from '../../util/bridge';
import { base64ToBlob } from '../../util/files';
import { useConfirm } from '../Confirm';
import { useChangeBackground } from '../hooks/nova/useChangeBackground';
import { useInsertDocsHandler } from '../hooks/nova/useInsertDocsHandler';
import { useRemakeImage } from '../hooks/nova/useRemakeImage';

import GoBackHeader from './GoBackHeader';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1 1 0;
  background-color: rgb(244, 246, 248);
  overflow-y: auto;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  margin: auto;
  overflow-y: auto;
`;

const Guide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 24px;
`;

const Title = styled.div<{ lang: string }>`
  display: flex;
  flex-direction: ${(props) => (props.lang === 'en' ? 'column' : 'row')};
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
  aspect-ratio: 1;
  max-width: 480px;
  max-height: 480px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: ${(props) => (props.isBordered ? '1px solid #c9cdd2' : 'none')};
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  background: #e8e8ed;

  img,
  video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: ${(props) => (props.isBordered ? 'none' : '8px')};
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 16px;
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
  background: white;

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
  align-items: center;
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
  background: white;
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
  const isMobile = platform == ClientType.ios || platform == ClientType.android;
  const isPC = platform === ClientType.windows || platform === ClientType.mac;
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const currentFile = useAppSelector(getCurrentFile);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { insertDocsHandler } = useInsertDocsHandler();
  const { handleChangeBackground } = useChangeBackground();
  const { handleRemakeImage } = useRemakeImage();
  const [showInsertDocBtn, setShowInsertDocBtn] = useState(true);

  useEffect(() => {
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        if (selectedNovaTab === NOVA_TAB_TYPE.convert2DTo3D) {
          setShowInsertDocBtn(status !== 'home' && isPC && currentFile.ext === 'pptx');
        } else {
          setShowInsertDocBtn(status !== 'home' || isMobile);
        }
      }
    });
  }, [selectedNovaTab]);

  const ShowExpireLinkPopup = async () => {
    confirm({
      title: '',
      msg: t('Nova.Confirm.ExpireImageLink.Msg'),
      onOk: {
        text: t('OK'),
        callback: () => {
          dispatch(setLocalFiles([]));
          dispatch(setDriveFiles([]));
          dispatch(resetPageData(selectedNovaTab));
          dispatch(resetPageResult(selectedNovaTab));
          dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
        }
      }
    });
  };

  const OnSave = async () => {
    if (result) {
      if (result.link) {
        try {
          const res = await fetch(result.link, { method: 'HEAD' });
          const contentType = res.headers.get('Content-Type');
          if (contentType && contentType.includes('text/html')) {
            ShowExpireLinkPopup();
          } else {
            dispatch(setPageStatus({ tab: selectedNovaTab, status: 'saving' }));
            Bridge.callBridgeApi('downloadAnimation', result.link);
          }
        } catch (err) {
          if (!navigator.onLine) {
            dispatch(setOnlineStatus(false));
          } else {
            ShowExpireLinkPopup();
          }
        }
      } else {
        const blob = base64ToBlob(result.data, result.contentType);
        Bridge.callBridgeApi('downloadImage', blob);
      }
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
      <Container>
        <Body>
          <Guide>
            <Title lang={lang}>
              <img src={CheckIcon} alt="check" />
              <span>{t(`Nova.${selectedNovaTab}.Done.Title`)}</span>
            </Title>
            {selectedNovaTab === NOVA_TAB_TYPE.convert2DTo3D &&
            isPC &&
            currentFile.ext === 'pptx' ? (
              <SubTitle>{t(`Nova.${selectedNovaTab}.Done.SubTitle2`)}</SubTitle>
            ) : (
              <SubTitle>{t(`Nova.${selectedNovaTab}.Done.SubTitle`)}</SubTitle>
            )}
          </Guide>
          <ImageBox
            isBordered={
              selectedNovaTab === NOVA_TAB_TYPE.removeBG ||
              selectedNovaTab === NOVA_TAB_TYPE.convert2DTo3D
            }>
            {result?.link ? (
              result.link.endsWith('.mp4') ? (
                <ReactPlayer url={result.link} loop playing playsinline muted />
              ) : (
                <img src={result.link} alt="result" />
              )
            ) : (
              <img src={`data:${result?.contentType};base64,${result?.data}`} alt="result" />
            )}
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
      </Container>
    </Wrap>
  );
}
