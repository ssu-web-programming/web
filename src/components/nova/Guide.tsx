import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';

import aiChatIcon from '../../img/common/nova/imgSample/ai_chat_sample.svg';
import changeBGIcon from '../../img/common/nova/imgSample/bg_change_sample.svg';
import removeBGIcon from '../../img/common/nova/imgSample/bg_delete_sample.svg';
import convert2DTo3DIcon from '../../img/common/nova/imgSample/convert_2dto3d_smaple.gif';
import expandImgIcon from '../../img/common/nova/imgSample/image_expand_sample.svg';
import remakeImgIcon from '../../img/common/nova/imgSample/image_remake_sample.svg';
import changeStyleIcon from '../../img/common/nova/imgSample/image_style_sample.svg';
import improvedResIcon from '../../img/common/nova/imgSample/image_upscaling_sample.svg';
import perplexityIcon from '../../img/common/nova/imgSample/perplexity_sample.svg';
import { ReactComponent as IconConvert } from '../../img/light/nova/tab/convert_Img.svg';
import { announceInfoSelector } from '../../store/slices/nova/announceSlice';
import { novaChatModeSelector } from '../../store/slices/nova/novaHistorySlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import Announcement from '../Announcement';

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  flex: 1 1 0;
  overflow-y: auto;
`;

const GuideWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const GuideImage = styled.img`
  border-radius: 8px;
`;

const GuideTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;

  div.title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: ${({ theme }) => theme.color.text.main};
  }

  p.subTitle {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.color.text.gray03};
    text-align: center;
    white-space: break-spaces;
  }
`;
const GuideBody = styled.div`
  width: 100%;
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`;

const StyledIconConvert = styled(IconConvert)`
  path {
    fill: ${({ theme }) => theme.color.text.main};
  }
`;

interface GuideProps {
  children: React.ReactNode;
}

export const Guide = (props: GuideProps) => {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const chatMode = useAppSelector(novaChatModeSelector);
  const announceInfo = useAppSelector(announceInfoSelector(selectedNovaTab));

  const iconMap: Record<NOVA_TAB_TYPE, string> = {
    home: '',
    aiChat: aiChatIcon,
    perplexity: perplexityIcon,
    convert2DTo3D: convert2DTo3DIcon,
    removeBG: removeBGIcon,
    changeBG: changeBGIcon,
    remakeImg: remakeImgIcon,
    expandImg: expandImgIcon,
    improvedRes: improvedResIcon,
    changeStyle: changeStyleIcon,
    translation: aiChatIcon,
    voiceDictation: aiChatIcon,
    aiVideo: aiChatIcon
  };

  const getTranslationKey = () => {
    switch (selectedNovaTab) {
      case NOVA_TAB_TYPE.convert2DTo3D:
        return (
          <Trans
            i18nKey={`Nova.${selectedNovaTab}.Guide.Title`}
            components={{
              img: <StyledIconConvert height={18} width={19} />
            }}
          />
        );
      default:
        return t(`Nova.${selectedNovaTab}.Guide.Title`);
    }
  };

  return (
    <Container>
      <GuideWrapper>
        {announceInfo.status && <Announcement content={announceInfo.content} />}
        <GuideTitle>
          <GuideImage src={iconMap[selectedNovaTab]} alt="aiChat" />
          <div className="title">
            <p>{getTranslationKey()}</p>
          </div>
          <p className="subTitle">{t(`Nova.${selectedNovaTab}.Guide.SubTitle`)}</p>
        </GuideTitle>

        <GuideBody>{props.children}</GuideBody>
      </GuideWrapper>
    </Container>
  );
};
