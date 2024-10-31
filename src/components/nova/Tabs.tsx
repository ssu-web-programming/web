import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

import convert2DTo3DIcon from '../../img/nova/tab/tab_3d_n.svg';
import convert2DTo3DSelectedIcon from '../../img/nova/tab/tab_3d_s.svg';
import aiChatIcon from '../../img/nova/tab/tab_ai_chat_n.svg';
import aiChatSelectedIcon from '../../img/nova/tab/tab_ai_chat_s.svg';
import leftArrowIcon from '../../img/nova/tab/tab_arrow_left.svg';
import rightArrowIcon from '../../img/nova/tab/tab_arrow_right.svg';
import changeBGIcon from '../../img/nova/tab/tab_bg_change_n.svg';
import changeBGSelectedIcon from '../../img/nova/tab/tab_bg_change_s.svg';
import removeBGIcon from '../../img/nova/tab/tab_bg_delete_n.svg';
import removeBGSelectedIcon from '../../img/nova/tab/tab_bg_delete_s.svg';
import expandImgIcon from '../../img/nova/tab/tab_expansion_n.svg';
import expandImgSelectedIcon from '../../img/nova/tab/tab_expansion_s.svg';
import improvedResIcon from '../../img/nova/tab/tab_quality_n.svg';
import improvedResSelectedIcon from '../../img/nova/tab/tab_quality_s.svg';
import remakeImgIcon from '../../img/nova/tab/tab_remake_n.svg';
import remakeImgSelectedIcon from '../../img/nova/tab/tab_remake_s.svg';
import changeStyleIcon from '../../img/nova/tab/tab_style_n.svg';
import changeStyleSelectedIcon from '../../img/nova/tab/tab_style_s.svg';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { ClientType, getPlatform } from '../../util/bridge';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const iconMap: Record<NOVA_TAB_TYPE, { default: string; selected: string }> = {
  aiChat: { default: aiChatIcon, selected: aiChatSelectedIcon },
  convert2DTo3D: { default: convert2DTo3DIcon, selected: convert2DTo3DSelectedIcon },
  removeBG: { default: removeBGIcon, selected: removeBGSelectedIcon },
  changeBG: { default: changeBGIcon, selected: changeBGSelectedIcon },
  remakeImg: { default: remakeImgIcon, selected: remakeImgSelectedIcon },
  expandImg: { default: expandImgIcon, selected: expandImgSelectedIcon },
  improvedRes: { default: improvedResIcon, selected: improvedResSelectedIcon },
  changeStyle: { default: changeStyleIcon, selected: changeStyleSelectedIcon }
};

const Wrap = styled.div`
  width: 100%;
  height: 52px;
  min-height: 52px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px 16px;
  z-index: 1;
`;

const Tap = styled.div<{ isHighlighted: boolean }>`
  height: 32px;
  display: flex;
  align-items: center;
  padding: 6px 12px 6px 8px;
  border: 1px solid ${(props) => (props.isHighlighted ? '#c6a9ff' : '#c9cdd2')};
  border-radius: 8px;
  background-color: ${(props) => (props.isHighlighted ? '#ede5fe' : 'white')};
  cursor: pointer;
`;

const Badge = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fb4949;
  border-radius: 4px;

  span {
    font-size: 10px;
    font-weight: 300;
    line-height: 10px;
    color: white;
  }
`;

const Text = styled.div<{ isHighlighted: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.isHighlighted ? 500 : 400)};
  color: ${(props) => (props.isHighlighted ? '#511bb2' : 'black')};
`;

const CustomNavButton = styled.button<{ isVisible: boolean }>`
  width: 52px;
  height: 52px;
  top: var(--swiper-navigation-top-offset, 40%);
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }

  :after {
    display: none;
  }
`;

interface TabProps {
  tabs: NOVA_TAB_TYPE[];
  activeTab: string;
  onChangeTab: (tab: NOVA_TAB_TYPE) => void;
}

const Tabs = ({ tabs, activeTab, onChangeTab }: TabProps) => {
  const { t } = useTranslation();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<any>(null);

  const getTabTranslationKey = (tab: NOVA_TAB_TYPE): string => {
    return `Nova.Tabs.${tab}`;
  };

  const getIcon = (tab: NOVA_TAB_TYPE, isSelected: boolean): string => {
    return isSelected ? iconMap[tab].selected : iconMap[tab].default;
  };

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev(20);
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext(20);
    }
  };

  return (
    <Wrap>
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        watchOverflow={true}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next'
        }}
        onSlideChange={(swiper: SwiperClass) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSwiper={(swiper: SwiperClass) => {
          swiperRef.current = swiper;
        }}
        pagination={{ clickable: true }}
        style={{ height: '32px' }}>
        {tabs.map((tab) => (
          <SwiperSlide key={tab} style={{ width: 'auto' }}>
            <Tap onClick={() => onChangeTab(tab)} isHighlighted={activeTab === tab}>
              {tab === NOVA_TAB_TYPE.convert2DTo3D && (
                <Badge>
                  <span>N</span>
                </Badge>
              )}
              <img src={getIcon(tab, activeTab === tab)} alt="logo" />
              <Text isHighlighted={activeTab === tab}>{t(getTabTranslationKey(tab))}</Text>
            </Tap>
          </SwiperSlide>
        ))}
      </Swiper>

      {!(getPlatform() === ClientType.android || getPlatform() === ClientType.ios) && (
        <>
          <CustomNavButton
            className="swiper-button-prev left"
            isVisible={!isBeginning}
            onClick={handlePrevClick}>
            <img src={leftArrowIcon} alt="Left Arrow" />
          </CustomNavButton>
          <CustomNavButton
            className="swiper-button-next right"
            isVisible={!isEnd}
            onClick={handleNextClick}>
            <img src={rightArrowIcon} alt="Right Arrow" />
          </CustomNavButton>
        </>
      )}
    </Wrap>
  );
};

export default Tabs;
