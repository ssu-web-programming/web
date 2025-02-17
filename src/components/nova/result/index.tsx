import { useEffect, useState } from 'react';
import InsertDocsDarkIcon from 'img/dark/ico_insert_docs.svg';
import DownloadIcon from 'img/light/ico_download_white.svg';
import InsertDocsLightIcon from 'img/light/ico_insert_docs.svg';
import { lang } from 'locale';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { setOnlineStatus } from 'store/slices/network';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import CheckDarkIcon from '../../../img/dark/nova/check_purple.svg';
import CreditColorIcon from '../../../img/light/ico_credit_color.svg';
import CheckLightIcon from '../../../img/light/nova/check_purple.svg';
import { ClientStatusType } from '../../../pages/Nova/Nova';
import {
  resetPageData,
  resetPageResult,
  selectPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { activeToast } from '../../../store/slices/toastSlice';
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge, { ClientType, getPlatform } from '../../../util/bridge';
import { base64ToBlob } from '../../../util/files';
import Button from '../../buttons/Button';
import { useConfirm } from '../../Confirm';
import { useChangeBackground } from '../../hooks/nova/useChangeBackground';
import { useInsertDocsHandler } from '../../hooks/nova/useInsertDocsHandler';
import { useRemakeImage } from '../../hooks/nova/useRemakeImage';

import * as S from './style';

interface ResultProps {
  children?: React.ReactNode;
}

export default function Result({ children }: ResultProps) {
  const platform = getPlatform();
  const isMobile = platform == ClientType.ios || platform == ClientType.android;
  const isPC = platform === ClientType.windows || platform === ClientType.mac;
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
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
    <S.Wrap>
      <S.Container>
        <S.Body>
          <S.Guide>
            <S.Title lang={lang}>
              <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} alt="check" />
              <span>{t(`Nova.${selectedNovaTab}.Done.Title`)}</span>
            </S.Title>
            {selectedNovaTab === NOVA_TAB_TYPE.convert2DTo3D &&
            isPC &&
            currentFile.ext === 'pptx' ? (
              <S.SubTitle>{t(`Nova.${selectedNovaTab}.Done.SubTitle2`)}</S.SubTitle>
            ) : (
              <S.SubTitle>{t(`Nova.${selectedNovaTab}.Done.SubTitle`)}</S.SubTitle>
            )}
          </S.Guide>
          {children ? (
            children
          ) : (
            <S.ImageBox
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
            </S.ImageBox>
          )}
          <S.ButtonWrap>
            {(selectedNovaTab === NOVA_TAB_TYPE.changeBG ||
              selectedNovaTab === NOVA_TAB_TYPE.remakeImg) && (
              <Button
                variant="gray"
                width={'full'}
                height={48}
                cssExt={css`
                  position: relative;
                  display: flex;
                  gap: 4px;
                  font-size: 16px;
                  font-weight: 500;
                  border: 1px solid ${isLightMode ? 'var(--gray-gray-40)' : 'var(--gray-gray-35)'};
                  border-radius: 8px;
                  background: ${isLightMode ? 'var(--white)' : 'none'};
                `}
                onClick={handleRemake}>
                <span>{t(`Nova.Result.Remake`)}</span>
                <img
                  src={CreditColorIcon}
                  alt="credit"
                  style={{ position: 'absolute', right: '12px' }}
                />
              </Button>
            )}
            <S.DefaultButtonWrap>
              {showInsertDocBtn && (
                <Button
                  variant="gray"
                  width={'full'}
                  height={48}
                  cssExt={css`
                    display: flex;
                    gap: 4px;
                    font-size: 16px;
                    font-weight: 500;
                    border: 1px solid ${isLightMode ? 'var(--gray-gray-40)' : 'var(--gray-gray-35)'};
                    border-radius: 8px;
                    background: ${isLightMode ? 'var(--white)' : 'none'};
                  `}
                  onClick={() => insertDocsHandler()}>
                  <img src={isLightMode ? InsertDocsLightIcon : InsertDocsDarkIcon} alt="docs" />
                  <span>{t(`Nova.Result.InsertDoc`)}</span>
                </Button>
              )}
              <Button
                variant="purple"
                width={'full'}
                height={48}
                cssExt={css`
                  display: flex;
                  gap: 4px;
                  font-size: 16px;
                  font-weight: 500;
                  border-radius: 8px;
                `}
                onClick={OnSave}>
                <img src={DownloadIcon} alt="download" />
                <span>{t(`Nova.Result.Save`)}</span>
              </Button>
            </S.DefaultButtonWrap>
          </S.ButtonWrap>
        </S.Body>
      </S.Container>
    </S.Wrap>
  );
}
