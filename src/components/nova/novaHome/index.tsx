import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { FileUploadState } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
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
import { novaHistorySelector, setChatMode } from '../../../store/slices/nova/novaHistorySlice';
import { setPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { selectNovaTab, selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';
import Banner from '../banner';
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
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const dispatch = useAppDispatch();

  const novaHistory = useAppSelector(novaHistorySelector);
  const { creating } = useAppSelector(selectTabSlice);

  const [inputContents, setInputContents] = useState<string>('');

  useEffect(() => {
    if (location.state) {
      const { inputText } = location.state.body;
      setInputContents(inputText);
    }
  }, [location.state]);

  const handleMovePage = (tab: NOVA_TAB_TYPE) => {
    dispatch(selectNovaTab(tab));
    dispatch(setIsExternal(false));
    Bridge.callBridgeApi('curNovaTab', tab);

    if (tab === NOVA_TAB_TYPE.aiVideo) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
    } else if (tab === NOVA_TAB_TYPE.perplexity) {
      dispatch(setChatMode(SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO));
    }
  };

  const getTabTranslationKey = (tab: NOVA_TAB_TYPE) => {
    if (tab === NOVA_TAB_TYPE.convert2DTo3D) {
      return (
        <Trans
          i18nKey={`Nova.Home.image.${tab}`}
          components={{
            img: isLightMode ? <IconConvertLight /> : <IconConvertDark />
          }}
        />
      );
    }

    return t(`Nova.Home.image.${tab}`);
  };

  return (
    <>
      <Banner />
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
