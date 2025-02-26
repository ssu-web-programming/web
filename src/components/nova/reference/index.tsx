import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';

import ArrowDownDarkIcon from '../../../img/dark/ico_arrow_down_accordion.svg';
import LinkDarkIcon from '../../../img/dark/nova/ico_link.svg';
import SkeletonMobileDark from '../../../img/dark/nova/skeleton_ref_mobile.json';
import SkeletonPCDark from '../../../img/dark/nova/skeleton_ref_pc.json';
import ArrowDownLightIcon from '../../../img/light/ico_arrow_down_accordion.svg';
import LinkLightIcon from '../../../img/light/nova/ico_link.svg';
import SkeletonMobileLight from '../../../img/light/nova/skeleton_ref_mobile.json';
import SkeletonPCLight from '../../../img/light/nova/skeleton_ref_pc.json';
import { NovaWebReference } from '../../../store/slices/nova/novaHistorySlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';
import Bridge, { isMobile } from '../../../util/bridge';
import ModalSheet from '../../modalSheet';
import Skeleton from '../../Skeleton';

import * as S from './style';
import { SkeletonWrap } from './style';

interface referenceProps {
  references: NovaWebReference[];
}

export default function Reference({ references }: referenceProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const maxItemsToShow = isMobile
    ? 3
    : isExpanded
      ? Math.min(references.length, 8)
      : Math.min(references.length, 4);

  const toggleExpanded = () => {
    setIsExpanded((prev: boolean) => !prev);
  };

  const openLink = async (url: string) => {
    await Bridge.callBridgeApi('openWindow', url);
  };

  return (
    <S.Container>
      <S.Header>
        <span>{t('Nova.perplexity.source')}</span>
        {!isMobile && references.length > 4 && (
          <S.StyledButton onClick={toggleExpanded} isExpanded={isExpanded}>
            {isExpanded
              ? t('Nova.perplexity.button.collapse')
              : t('Nova.perplexity.button.viewMore')}
            <img src={isLightMode ? ArrowDownLightIcon : ArrowDownDarkIcon} alt="arrow" />
          </S.StyledButton>
        )}
      </S.Header>
      {references.length > 0 ? (
        <S.ItemWrap>
          {references.slice(0, maxItemsToShow).map((ref, index) => (
            <S.Item key={index} onClick={() => openLink(ref.url)} isMobile={isMobile}>
              {!isMobile && (
                <div className="title">
                  <span>{ref.title}</span>
                </div>
              )}
              <div className="site">
                <img
                  src={ref.favicon ? ref.favicon : isLightMode ? LinkLightIcon : LinkDarkIcon}
                  alt="favicon"
                />
                <span>{ref.site ? ref.site : new URL(ref.url).hostname}</span>
              </div>
            </S.Item>
          ))}
          {isMobile && references.length > 3 && (
            <S.Item
              onClick={() => {
                setIsOpen(true);
              }}
              isMobile={isMobile}
              className="more">
              <span>{t(`Nova.perplexity.button.countMore`, { count: references.length - 3 })}</span>
            </S.Item>
          )}
          <ModalSheet isOpen={isOpen} setIsOpen={setIsOpen} detent="content-height">
            <S.SheetWrap>
              <S.SheetHeader>{t('Nova.perplexity.source')}</S.SheetHeader>
              <S.SheetContent>
                {references.map((ref, idx) => (
                  <React.Fragment key={idx}>
                    <S.SheetItem onClick={() => openLink(ref.url)}>
                      <div className="title">{`${idx + 1}. ${ref.title}`}</div>
                      <div className="desc">{ref.desc}</div>
                    </S.SheetItem>
                    <div className="driver" />
                  </React.Fragment>
                ))}
              </S.SheetContent>
            </S.SheetWrap>
          </ModalSheet>
        </S.ItemWrap>
      ) : isMobile ? (
        <S.SkeletonWrap>
          {Array.from({ length: 3 }).map((_, idx) => {
            return (
              <S.SkeletonContainer key={idx}>
                <S.SkeletonCircle />
                <S.SkeletonLargeBox />
              </S.SkeletonContainer>
            );
          })}
        </S.SkeletonWrap>
      ) : (
        <Lottie
          animationData={isLightMode ? SkeletonPCLight : SkeletonPCDark}
          loop
          play
          style={{ width: 288, height: 90 }}
        />
      )}
    </S.Container>
  );
}
