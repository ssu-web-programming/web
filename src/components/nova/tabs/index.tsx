import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NOVA_TAB_TYPE } from 'store/slices/tabSlice';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';
import styled, { FlattenSimpleInterpolation } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { isMobile } from 'util/bridge';

import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import convert2DTo3DDarkIcon from '../../../img/dark/nova/tab/tab_3d_dark_n.svg';
import convert2DTo3DDarkSelectedIcon from '../../../img/dark/nova/tab/tab_3d_dark_s.svg';
import aiChatDarkIcon from '../../../img/dark/nova/tab/tab_ai_chat_dark_n.svg';
import aiChatDarkSelectedIcon from '../../../img/dark/nova/tab/tab_ai_chat_dark_s.svg';
import leftArrowDarkIcon from '../../../img/dark/nova/tab/tab_arrow_left.svg';
import rightArrowDarkIcon from '../../../img/dark/nova/tab/tab_arrow_right.svg';
import changeBGDarkIcon from '../../../img/dark/nova/tab/tab_bg_change_dark_n.svg';
import changeBGDarkSelectedIcon from '../../../img/dark/nova/tab/tab_bg_change_dark_s.svg';
import removeBGDarkIcon from '../../../img/dark/nova/tab/tab_bg_delete_dark_n.svg';
import removeBGDarkSelectedIcon from '../../../img/dark/nova/tab/tab_bg_delete_dark_s.svg';
import expandImgDarkIcon from '../../../img/dark/nova/tab/tab_expansion_dark_n.svg';
import expandImgDarkSelectedIcon from '../../../img/dark/nova/tab/tab_expansion_dark_s.svg';
import improvedResDarkIcon from '../../../img/dark/nova/tab/tab_quality_dark_n.svg';
import improvedResDarkSelectedIcon from '../../../img/dark/nova/tab/tab_quality_dark_s.svg';
import remakeImgDarkIcon from '../../../img/dark/nova/tab/tab_remake_dark_n.svg';
import remakeImgDarkSelectedIcon from '../../../img/dark/nova/tab/tab_remake_dark_s.svg';
import changeStyleDarkIcon from '../../../img/dark/nova/tab/tab_style_dark_n.svg';
import changeStyleDarkSelectedIcon from '../../../img/dark/nova/tab/tab_style_dark_s.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import convert2DTo3DLightIcon from '../../../img/light/nova/tab/tab_3d_n.svg';
import convert2DTo3DLightSelectedIcon from '../../../img/light/nova/tab/tab_3d_s.svg';
import aiChatLightIcon from '../../../img/light/nova/tab/tab_ai_chat_n.svg';
import aiChatLightSelectedIcon from '../../../img/light/nova/tab/tab_ai_chat_s.svg';
import leftArrowLightIcon from '../../../img/light/nova/tab/tab_arrow_left.svg';
import rightArrowLightIcon from '../../../img/light/nova/tab/tab_arrow_right.svg';
import changeBGLightIcon from '../../../img/light/nova/tab/tab_bg_change_n.svg';
import changeBGLightSelectedIcon from '../../../img/light/nova/tab/tab_bg_change_s.svg';
import removeBGLightIcon from '../../../img/light/nova/tab/tab_bg_delete_n.svg';
import removeBGLightSelectedIcon from '../../../img/light/nova/tab/tab_bg_delete_s.svg';
import expandImgLightIcon from '../../../img/light/nova/tab/tab_expansion_n.svg';
import expandImgLightSelectedIcon from '../../../img/light/nova/tab/tab_expansion_s.svg';
import improvedResLightIcon from '../../../img/light/nova/tab/tab_quality_n.svg';
import improvedResLightSelectedIcon from '../../../img/light/nova/tab/tab_quality_s.svg';
import remakeImgLightIcon from '../../../img/light/nova/tab/tab_remake_n.svg';
import remakeImgLightSelectedIcon from '../../../img/light/nova/tab/tab_remake_s.svg';
import changeStyleLightIcon from '../../../img/light/nova/tab/tab_style_n.svg';
import changeStyleLightSelectedIcon from '../../../img/light/nova/tab/tab_style_s.svg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const iconMap: Record<
  NOVA_TAB_TYPE,
  {
    light: { default: string; selected: string };
    dark: { default: string; selected: string };
  }
> = {
  aiChat: {
    light: { default: aiChatLightIcon, selected: aiChatLightSelectedIcon },
    dark: { default: aiChatDarkIcon, selected: aiChatDarkSelectedIcon }
  },
  convert2DTo3D: {
    light: { default: convert2DTo3DLightIcon, selected: convert2DTo3DLightSelectedIcon },
    dark: { default: convert2DTo3DDarkIcon, selected: convert2DTo3DDarkSelectedIcon }
  },
  removeBG: {
    light: { default: removeBGLightIcon, selected: removeBGLightSelectedIcon },
    dark: { default: removeBGDarkIcon, selected: removeBGDarkSelectedIcon }
  },
  changeBG: {
    light: { default: changeBGLightIcon, selected: changeBGLightSelectedIcon },
    dark: { default: changeBGDarkIcon, selected: changeBGDarkSelectedIcon }
  },
  remakeImg: {
    light: { default: remakeImgLightIcon, selected: remakeImgLightSelectedIcon },
    dark: { default: remakeImgDarkIcon, selected: remakeImgDarkSelectedIcon }
  },
  expandImg: {
    light: { default: expandImgLightIcon, selected: expandImgLightSelectedIcon },
    dark: { default: expandImgDarkIcon, selected: expandImgDarkSelectedIcon }
  },
  improvedRes: {
    light: { default: improvedResLightIcon, selected: improvedResLightSelectedIcon },
    dark: { default: improvedResDarkIcon, selected: improvedResDarkSelectedIcon }
  },
  changeStyle: {
    light: { default: changeStyleLightIcon, selected: changeStyleLightSelectedIcon },
    dark: { default: changeStyleDarkIcon, selected: changeStyleDarkSelectedIcon }
  }
};

const Wrap = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
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
  background-color: ${({ theme }) => theme.color.bg};

  ${(props) => props.cssExt || ''};
`;

const Tap = styled.div<{ isHighlighted: boolean }>`
  height: 32px;
  display: flex;
  align-items: center;
  padding: 6px 12px 6px 8px;
  border: 1px solid
    ${(props) =>
      props.isHighlighted ? props.theme.color.tab.highlightBorder : props.theme.color.tab.border};
  border-radius: 8px;
  background-color: ${(props) =>
    props.isHighlighted ? props.theme.color.tab.highlightBg : props.theme.color.tab.bg};
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
  color: ${(props) =>
    props.isHighlighted ? props.theme.color.tab.highlightText : props.theme.color.tab.text};
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

const StyledIconConvertLight = styled(IconConvertLight)<{ $isHighlighted: boolean }>`
  path {
    fill: ${(props) => (props.$isHighlighted ? '#511bb2' : 'black')};
  }
`;

const StyledIconConvertDark = styled(IconConvertDark)<{ $isHighlighted: boolean }>`
  path {
    fill: ${(props) => (props.$isHighlighted ? '#c6a9ff' : '#d8d8d8')};
  }
`;

interface TabProps {
  tabs: NOVA_TAB_TYPE[];
  activeTab?: string;
  onChangeTab: (tab: NOVA_TAB_TYPE) => void;
  showArrowBtn?: boolean;
  cssExt?: FlattenSimpleInterpolation;
}

const Tabs = ({ tabs, activeTab, onChangeTab, showArrowBtn = true, cssExt }: TabProps) => {
  const { t } = useTranslation();
  const { isLightMode, curTheme } = useAppSelector(themeInfoSelector);
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
            img: isLightMode ? (
              <StyledIconConvertLight $isHighlighted={isActive} height={11} />
            ) : (
              <StyledIconConvertDark $isHighlighted={isActive} height={11} />
            )
          }}
        />
      );
    }

    return t(`Nova.Tabs.${tab}`);
  };

  function getIcon(tab: NOVA_TAB_TYPE, isSelected: boolean): string {
    return isSelected ? iconMap[tab][curTheme].selected : iconMap[tab][curTheme].default;
  }

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
    <Wrap cssExt={cssExt}>
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        centeredSlides={isCentered && showArrowBtn}
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

      {!isMobile && showArrowBtn && (
        <>
          <CustomNavButton
            className="swiper-button-prev left"
            isVisible={!isBeginning}
            onClick={handlePrevClick}>
            <img src={isLightMode ? leftArrowLightIcon : leftArrowDarkIcon} alt="Left Arrow" />
          </CustomNavButton>
          <CustomNavButton
            className="swiper-button-next right"
            isVisible={!isEnd}
            onClick={handleNextClick}>
            <img src={isLightMode ? rightArrowLightIcon : rightArrowDarkIcon} alt="Right Arrow" />
          </CustomNavButton>
        </>
      )}
    </Wrap>
  );
};

export default Tabs;
