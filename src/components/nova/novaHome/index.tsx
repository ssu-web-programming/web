import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { FileUploadState } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getDownloadUrlByPlatform } from '../../../constants/platform';
import {
  findTabByService,
  iconMap,
  SERVICE_CATEGORY,
  SERVICE_GROUP_MAP,
  SERVICE_TYPE
} from '../../../constants/serviceType';
import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import { setIsExternal } from '../../../store/slices/appState';
import {
  novaChatModeSelector,
  novaHistorySelector,
  setChatMode
} from '../../../store/slices/nova/novaHistorySlice';
import { setPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { platformInfoSelector } from '../../../store/slices/platformInfo';
import { selectNovaTab, selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';
import { ClientType } from '../../../util/bridge';
import { isHigherVersion } from '../../../util/common';
import { useConfirm } from '../../Confirm';
import useShowConfirmModal from '../../hooks/use-show-confirm-modal';
import { useChatNova } from '../../hooks/useChatNova';
import { FileUploading } from '../FileUploading';
import InputBar, { InputBarSubmitParam } from '../inputBar';

import * as S from './style';

interface NovaHomeProps {
  expiredNOVA: boolean;
  setExpiredNOVA: (isExpired: boolean) => void;
  createChatSubmitHandler: (param: InputBarSubmitParam) => Promise<void>;
  fileUploadState: FileUploadState;
}

const NovaHome = (props: NovaHomeProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const chatNova = useChatNova();
  const confirm = useConfirm();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { platform, version } = useAppSelector(platformInfoSelector);

  const novaHistory = useAppSelector(novaHistorySelector);
  const chatMode = useAppSelector(novaChatModeSelector);
  const { creating } = useAppSelector(selectTabSlice);

  const showConfirmModal = useShowConfirmModal();

  const [inputContents, setInputContents] = useState<string>('');

  useEffect(() => {
    if (location.state) {
      const { inputText } = location.state.body;
      setInputContents(inputText);
    }
  }, [location.state]);

  const isUpdateRequired = () => {
    if (platform === ClientType.web || platform === ClientType.unknown) return false;

    type ClientType = 'android' | 'ios' | 'windows' | 'mac';
    const versionMap: Record<ClientType, string> = {
      android: '9.9.8',
      ios: '9.8.10',
      windows: '10.105.262',
      mac: '9.0.67'
    };
    return !isHigherVersion(versionMap[platform as keyof typeof versionMap], version);
  };

  const confirmUpload = async () => {
    if (platform === ClientType.windows) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.UpdateVersionWindows.Msg'),
        onOk: {
          text: t('Ok'),
          callback: () => {}
        }
      });
    } else {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.UpdateVersion.Msg'),
        onOk: {
          text: t('Nova.Confirm.UpdateVersion.Ok'),
          callback: () => {
            Bridge.callBridgeApi('openWindow', getDownloadUrlByPlatform(platform));
          }
        },
        onCancel: {
          text: t('Nova.Confirm.UpdateVersion.Cancel'),
          callback: () => {}
        }
      });
    }
  };

  const handleMovePage = async (tab: NOVA_TAB_TYPE) => {
    if (tab === NOVA_TAB_TYPE.translation || tab === NOVA_TAB_TYPE.voiceDictation) {
      console.log('location.state?.body', location.state?.body);

      // 위와 같이 들어갔을때는 location.body에 있는 값을 제거한다.
      if (location.state?.body) {
        const newState = { ...location.state };
        delete newState.body;

        window.history.replaceState(newState, '', window.location.pathname);
      }

      if (isUpdateRequired()) {
        confirmUpload();
        return;
      }
    }

    if (tab === NOVA_TAB_TYPE.aiVideo) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
    }
    if (tab === NOVA_TAB_TYPE.perplexity) {
      if (
        novaHistory.length > 0 &&
        ![
          SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
          SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
        ].includes(chatMode)
      ) {
        const ret = await showConfirmModal({
          msg: t('Nova.Confirm.ChangeChatMode.Msg') || '',
          onOk: {
            text: t('Nova.Confirm.ChangeChatMode.Ok') || '',
            handleOk: () => {
              chatNova.newChat(selectedNovaTab, novaHistory);
              dispatch(setChatMode(SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO));
            }
          },
          onCancel: {
            text: t('Cancel'),
            handleCancel: () => {
              return;
            }
          }
        });

        if (!ret) return;
      } else {
        dispatch(setChatMode(SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO));
      }
    }

    dispatch(setIsExternal(false));
    dispatch(selectNovaTab(tab));
    Bridge.callBridgeApi('curNovaTab', tab);
  };

  const getTabTranslationKey = (tab: NOVA_TAB_TYPE) => {
    return (
      <Trans
        i18nKey={`Nova.Home.image.${tab}`}
        components={{
          img: isLightMode ? <IconConvertLight /> : <IconConvertDark />
        }}
      />
    );
  };

  return (
    <>
      <S.Body>
        <S.ToolWrap>
          <S.ToolTitle>{t('Nova.Home.tools.title')}</S.ToolTitle>
          <S.AIToolWrap>
            {Object.entries(SERVICE_GROUP_MAP[SERVICE_CATEGORY.TOOLS]).map(([key, services]) => {
              const tab = findTabByService(services[0]);
              if (!tab) return null;

              return (
                <div key={key} onClick={() => handleMovePage(tab)}>
                  <img src={iconMap[tab] || ''} alt={key} />
                  <span>{t(`Nova.Home.tools.${tab}`)}</span>
                </div>
              );
            })}
          </S.AIToolWrap>
        </S.ToolWrap>
        <S.ToolWrap>
          <S.ToolTitle>{t('Nova.Home.image.title')}</S.ToolTitle>
          <S.AIImageWrap>
            {Object.entries(SERVICE_GROUP_MAP[SERVICE_CATEGORY.IMAGE]).map(([key, services]) => {
              const tab = findTabByService(services[0]);
              if (!tab) return null;

              return (
                <S.ImageItem key={key} onClick={() => handleMovePage(tab)}>
                  <img src={iconMap[tab] || ''} alt={key} />
                  <span>{getTabTranslationKey(tab)}</span>
                </S.ImageItem>
              );
            })}
          </S.AIImageWrap>
        </S.ToolWrap>
      </S.Body>
      <InputBar
        novaHistory={novaHistory}
        disabled={creating === 'NOVA'}
        expiredNOVA={props.expiredNOVA}
        onSubmit={props.createChatSubmitHandler}
        contents={inputContents}
        setContents={setInputContents}
      />
      <FileUploading {...props.fileUploadState} />
    </>
  );
};

export default NovaHome;
