import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

import { ReactComponent as IconConvert } from '../../img/nova/tab/convert_Img.svg';
import convertIcon from '../../img/nova/tab/convert_Img.svg';
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
import { isMobile } from '../../util/bridge';

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
    font-weight: bold;
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
  top: var(--swiper-navigation-top-offset, 42%);
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

const StyledIconConvert = styled(IconConvert)<{ $isHighlighted: boolean }>`
  path {
    fill: ${(props) => (props.$isHighlighted ? '#511bb2' : 'black')};
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
  const [isCentered, setIsCentered] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  const getTabTranslationKey = (tab: NOVA_TAB_TYPE, isActive: boolean) => {
    if (tab === 'convert2DTo3D') {
      return (
        <Trans
          i18nKey={`Nova.Tabs.${tab}`}
          components={{
            img: <StyledIconConvert $isHighlighted={isActive} height={11} />
          }}
        />
      );
    }

    return t(`Nova.Tabs.${tab}`);
  };

  const getIcon = (tab: NOVA_TAB_TYPE, isSelected: boolean) => {
    return isSelected ? iconMap[tab].selected : iconMap[tab].default;
  };

  const updateSwiperState = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const handleSlideChange = () => {
      if (!isCentered) {
        setIsCentered(true);
        // 다음 tick에서 swiper 업데이트 실행
        requestAnimationFrame(() => {
          swiper.update();
        });
      }
    };

    swiper.on('slideChange', handleSlideChange);
    swiper.on('touchEnd', updateSwiperState);
    updateSwiperState();

    return () => {
      swiper.off('slideChange', handleSlideChange);
      swiper.off('touchEnd', updateSwiperState);
    };
  }, [swiperRef, isCentered]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const activeTabIndex = tabs.findIndex((tab) => tab === activeTab);

    // 마지막 요소인 경우
    if (activeTabIndex === tabs.length - 1) {
      swiper.slideTo(tabs.length - 1);
      setIsCentered(false);
    } else {
      setIsCentered(true);
      swiper.slideTo(activeTabIndex);
    }

    swiper.update();
    updateSwiperState();
  }, [activeTab, swiperRef.current]);

  const handlePrevClick = () => {
    if (swiperRef.current) {
      if (!isCentered) setIsCentered(true);
      swiperRef.current.slidePrev();
      updateSwiperState();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      if (!isCentered) setIsCentered(true);
      swiperRef.current.slideNext();
      updateSwiperState();
    }
  };

  const handleMoveToActiveIndex = async (tab: NOVA_TAB_TYPE, idx: number) => {
    if (!isCentered) setIsCentered(true);
    onChangeTab(tab);

    if (swiperRef.current) {
      // 마지막 요소인 경우
      if (idx === tabs.length - 1) {
        swiperRef.current.slideTo(tabs.length - 1);
        // centeredSlides를 false로 변경하여 end로 이동
        setIsCentered(false);
      } else {
        swiperRef.current.slideTo(idx);
      }
      swiperRef.current.update();
    }
    updateSwiperState();
  };

  return (
    <Wrap>
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        centeredSlides={isCentered}
        centeredSlidesBounds={isCentered}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next'
        }}
        onSwiper={(swiper: SwiperClass) => {
          swiperRef.current = swiper;
        }}
        pagination={{ clickable: true }}
        observer={true}
        observeParents={true}
        updateOnWindowResize={true}
        style={{ height: '32px' }}>
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;

          return (
            <SwiperSlide key={tab} style={{ width: 'auto' }}>
              <Tap onClick={() => handleMoveToActiveIndex(tab, idx)} isHighlighted={isActive}>
                {tab === NOVA_TAB_TYPE.convert2DTo3D && (
                  <Badge>
                    <span>N</span>
                  </Badge>
                )}
                <img src={getIcon(tab, isActive)} alt="logo" />
                <Text isHighlighted={isActive}>{getTabTranslationKey(tab, isActive)}</Text>
              </Tap>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {!isMobile && (
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
