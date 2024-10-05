import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import aiChatIcon from '../../img/nova/imgSample/ai_chat_sample.png';
import changeBGIcon from '../../img/nova/imgSample/bg_change_sample.png';
import removeBGIcon from '../../img/nova/imgSample/bg_delete_sample.png';
import expandImgIcon from '../../img/nova/imgSample/image_expand_sample.png';
import remakeImgIcon from '../../img/nova/imgSample/image_remake_sample.png';
import changeStyleIcon from '../../img/nova/imgSample/image_style_sample.png';
import improvedResIcon from '../../img/nova/imgSample/image_upscaling_sample.png';
import { announceInfoSelector } from '../../store/slices/nova/announceSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import Announcement from '../Announcement';

const GuideWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 40px;
  padding: 8px 16px;
  background-color: #f4f6f8;
  flex: 1 1 0;
  overflow-y: auto;
`;

const GuideImage = styled.img`
  width: 120px;
  height: 80px;
`;

const GuideTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  div.title {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: #6f3ad0;
  }

  p.subTitle {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: #454c53;
    text-align: center;
    white-space: break-spaces;
  }
`;
const Guidebody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

interface GuideProps {
  children: React.ReactNode;
}

export const Guide = (props: GuideProps) => {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const announceInfo = useAppSelector(announceInfoSelector(selectedNovaTab));

  const iconMap: Record<NOVA_TAB_TYPE, string> = {
    aiChat: aiChatIcon,
    removeBG: removeBGIcon,
    changeBG: changeBGIcon,
    remakeImg: remakeImgIcon,
    expandImg: expandImgIcon,
    improvedRes: improvedResIcon,
    changeStyle: changeStyleIcon
  };

  return (
    <GuideWrapper>
      {announceInfo.isShow && <Announcement content={announceInfo.content} />}
      <GuideTitle>
        <GuideImage src={iconMap[selectedNovaTab]} alt="aiChat" />
        <div className="title">
          <p>{t(`Nova.${selectedNovaTab}.Guide.Title`)}</p>
        </div>
        <p className="subTitle">{t(`Nova.${selectedNovaTab}.Guide.SubTitle`)}</p>
      </GuideTitle>

      <Guidebody>{props.children}</Guidebody>
    </GuideWrapper>
  );
};
