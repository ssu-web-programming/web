import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FileUploadState } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import ChangeBGIcon from '../../../img/common/nova/imgSample/bg_change_sample.svg';
import RemoveBGIcon from '../../../img/common/nova/imgSample/bg_delete_sample.svg';
import Convert2DTo3DIcon from '../../../img/common/nova/imgSample/convert_2dto3d_smaple.gif';
import ExpandImgIcon from '../../../img/common/nova/imgSample/image_expand_sample.svg';
import RemakeImgIcon from '../../../img/common/nova/imgSample/image_remake_sample.svg';
import ChangeStyleIcon from '../../../img/common/nova/imgSample/image_style_sample.svg';
import improveImgIcon from '../../../img/common/nova/imgSample/image_upscaling_sample.svg';
import AIVideoLightIcon from '../../../img/light/nova/aiVideo/ico_ai_video.svg';
import PerplexityLightIcon from '../../../img/light/nova/perplexity/ico_perplexity.svg';
import TranslationLightIcon from '../../../img/light/nova/translation/ico_translation.svg';
import VoiceDictationLightIcon from '../../../img/light/nova/voiceDictation/ico_voice_dictation.svg';
import { setIsStartedByRibbon } from '../../../store/slices/appState';
import { novaHistorySelector } from '../../../store/slices/nova/novaHistorySlice';
import { selectNovaTab, selectTabSlice } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Banner from '../banner';
import { FileUploading } from '../FileUploading';
import InputBar, { InputBarSubmitParam } from '../inputBar';

import * as S from './style';

const AI_TOOLS = [
  { icon: PerplexityLightIcon, name: '웹 검색', alt: 'perplexity', tab: NOVA_TAB_TYPE.perplexity },
  { icon: TranslationLightIcon, name: '번역', alt: 'translation', tab: NOVA_TAB_TYPE.translation },
  {
    icon: VoiceDictationLightIcon,
    name: '받아쓰기',
    alt: 'voice dictation',
    tab: NOVA_TAB_TYPE.voiceDictation
  },
  { icon: AIVideoLightIcon, name: '비디오', alt: 'ai video', tab: NOVA_TAB_TYPE.aiVideo }
];

const AI_IMAGES = [
  { icon: RemoveBGIcon, name: '배경 제거', alt: 'removeBG', tab: NOVA_TAB_TYPE.removeBG },
  { icon: improveImgIcon, name: '해상도 향상', alt: 'improveRes', tab: NOVA_TAB_TYPE.improvedRes },
  { icon: ChangeBGIcon, name: '배경 변경', alt: 'changeBG', tab: NOVA_TAB_TYPE.changeBG },
  { icon: RemakeImgIcon, name: '이미지 리메이크', alt: 'remakeImg', tab: NOVA_TAB_TYPE.remakeImg },
  { icon: ExpandImgIcon, name: '이미지 확장', alt: 'expandImg', tab: NOVA_TAB_TYPE.expandImg },
  {
    icon: ChangeStyleIcon,
    name: '스타일 변환',
    alt: 'changeStyle',
    tab: NOVA_TAB_TYPE.changeStyle
  },
  {
    icon: Convert2DTo3DIcon,
    name: '2D -> 3D',
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
    dispatch(setIsStartedByRibbon(false));
  };

  return (
    <>
      <Banner />
      <S.Body>
        <S.ToolWrap>
          <S.ToolTitle>도구</S.ToolTitle>
          <S.AIToolWrap>
            {AI_TOOLS.map((tool, index) => (
              <div key={index} onClick={() => handleMovePage(tool.tab)}>
                <img src={tool.icon} alt={tool.alt} />
                <span>{tool.name}</span>
              </div>
            ))}
          </S.AIToolWrap>
        </S.ToolWrap>
        <S.ToolWrap>
          <S.ToolTitle>이미지</S.ToolTitle>
          <S.AIImageWrap>
            {AI_IMAGES.map((tool, index) => (
              <S.ImageItem key={index} onClick={() => handleMovePage(tool.tab)}>
                <img src={tool.icon} alt={tool.alt} />
                <span>{tool.name}</span>
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
