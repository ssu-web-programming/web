import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { FileUploadState } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../../constants/serviceType';
import ChangeBGIcon from '../../../img/common/nova/imgSample/bg_change_sample.png';
import RemoveBGIcon from '../../../img/common/nova/imgSample/bg_delete_sample.png';
import Convert2DTo3DIcon from '../../../img/common/nova/imgSample/convert_2dto3d_smaple.gif';
import AIVideoIcon from '../../../img/common/nova/imgSample/ico_ai_video.svg';
import PerplexityIcon from '../../../img/common/nova/imgSample/ico_perplexity.svg';
import TranslationIcon from '../../../img/common/nova/imgSample/ico_translation.svg';
import ExpandImgIcon from '../../../img/common/nova/imgSample/image_expand_sample.png';
import RemakeImgIcon from '../../../img/common/nova/imgSample/image_remake_sample.png';
import ChangeStyleIcon from '../../../img/common/nova/imgSample/image_style_sample.png';
import improveImgIcon from '../../../img/common/nova/imgSample/image_upscaling_sample.png';
import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import VoiceDictationIcon from '../../../img/light/nova/voiceDictation/ico_voice_dictation.svg';
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

const AI_TOOLS = [
  { icon: PerplexityIcon, alt: 'perplexity', tab: NOVA_TAB_TYPE.perplexity },
  { icon: TranslationIcon, alt: 'translation', tab: NOVA_TAB_TYPE.translation },
  {
    icon: VoiceDictationIcon,
    alt: 'voice dictation',
    tab: NOVA_TAB_TYPE.voiceDictation
  },
  { icon: AIVideoIcon, alt: 'ai video', tab: NOVA_TAB_TYPE.aiVideo }
];

const AI_IMAGES = [
  { icon: RemoveBGIcon, alt: 'removeBG', tab: NOVA_TAB_TYPE.removeBG },
  { icon: improveImgIcon, alt: 'improveRes', tab: NOVA_TAB_TYPE.improvedRes },
  { icon: ChangeBGIcon, alt: 'changeBG', tab: NOVA_TAB_TYPE.changeBG },
  { icon: RemakeImgIcon, alt: 'remakeImg', tab: NOVA_TAB_TYPE.remakeImg },
  { icon: ExpandImgIcon, alt: 'expandImg', tab: NOVA_TAB_TYPE.expandImg },
  {
    icon: ChangeStyleIcon,
    alt: 'changeStyle',
    tab: NOVA_TAB_TYPE.changeStyle
  },
  {
    icon: Convert2DTo3DIcon,
    alt: 'convert2DTo3D',
    tab: NOVA_TAB_TYPE.convert2DTo3D
  }
];

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
    } else if (tab === NOVA_TAB_TYPE.voiceDictation) {
      dispatch(setChatMode(SERVICE_TYPE.NOVA_VOICE_DICTATION));
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
            {AI_TOOLS.map((tool, index) => (
              <div key={index} onClick={() => handleMovePage(tool.tab)}>
                <img src={tool.icon} alt={tool.alt} />
                <span>{t(`Nova.Home.tools.${tool.tab}`)}</span>
              </div>
            ))}
          </S.AIToolWrap>
        </S.ToolWrap>
        <S.ToolWrap>
          <S.ToolTitle>{t('Nova.Home.image.title')}</S.ToolTitle>
          <S.AIImageWrap>
            {AI_IMAGES.map((tool, index) => (
              <S.ImageItem key={index} onClick={() => handleMovePage(tool.tab)}>
                <img src={tool.icon} alt={tool.alt} />
                <span>{getTabTranslationKey(tool.tab)}</span>
              </S.ImageItem>
            ))}
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
