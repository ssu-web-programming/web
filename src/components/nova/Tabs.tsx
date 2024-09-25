import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

import aiChatIcon from '../../img/nova/tab/tab_aiChat_n.png';
import aiChatSelectedIcon from '../../img/nova/tab/tab_aiChat_s.png';
import leftArrowIcon from '../../img/nova/tab/tab_arrow_left.svg';
import rightArrowIcon from '../../img/nova/tab/tab_arrow_right.svg';
import changeBGIcon from '../../img/nova/tab/tab_changeBG_n.png';
import changeBGSelectedIcon from '../../img/nova/tab/tab_changeBG_s.png';
import changeStyleIcon from '../../img/nova/tab/tab_changeStyle_n.png';
import changeStyleSelectedIcon from '../../img/nova/tab/tab_changeStyle_s.png';
import expandImgIcon from '../../img/nova/tab/tab_expandImg_n.png';
import expandImgSelectedIcon from '../../img/nova/tab/tab_expandImg_s.png';
import improvedResIcon from '../../img/nova/tab/tab_improvedRes_n.png';
import improvedResSelectedIcon from '../../img/nova/tab/tab_improvedRes_s.png';
import remakeImgIcon from '../../img/nova/tab/tab_remakeImg_n.png';
import remakeImgSelectedIcon from '../../img/nova/tab/tab_remakeImg_s.png';
import removeBGIcon from '../../img/nova/tab/tab_removeBG_n.png';
import removeBGSelectedIcon from '../../img/nova/tab/tab_removeBG_s.png';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { ClientType, getPlatform } from '../../util/bridge';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const iconMap: Record<NOVA_TAB_TYPE, { default: string; selected: string }> = {
  aiChat: { default: aiChatIcon, selected: aiChatSelectedIcon },
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
  overflow: hidden;
  background-color: rgb(244, 246, 248);
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
  background: none;
  border: none;
  cursor: pointer;

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
