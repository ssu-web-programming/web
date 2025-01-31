import { useState } from 'react';

import ArrowDownDarkIcon from '../../../img/dark/ico_arrow_down_accordion.svg';
import LinkDarkIcon from '../../../img/dark/nova/ico_link.svg';
import ArrowDownLightIcon from '../../../img/light/ico_arrow_down_accordion.svg';
import LinkLightIcon from '../../../img/light/nova/ico_link.svg';
import { NovaWebReference } from '../../../store/slices/nova/novaHistorySlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';
import ModalSheet from '../../modalSheet';

import * as S from './style';

interface referenceProps {
  references: NovaWebReference[];
}

export default function Reference({ references }: referenceProps) {
  const isMobile = true;
  const { isLightMode } = useAppSelector(themeInfoSelector);

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

  const openModal = () => {
    console.log('click');
  };

  return (
    <S.Container>
      <S.Header>
        <span>출처</span>
        {!isMobile && references.length > 4 && (
          <S.StyledButton onClick={toggleExpanded} isExpanded={isExpanded}>
            {isExpanded ? '접기' : '더보기'}
            <img src={isLightMode ? ArrowDownLightIcon : ArrowDownDarkIcon} alt="arrow" />
          </S.StyledButton>
        )}
      </S.Header>
      <S.ItemWrap>
        {references.slice(0, maxItemsToShow).map((ref, index) => (
          <S.Item
            key={index}
            onClick={() => Bridge.callBridgeApi('openWindow', ref.url)}
            isMobile={isMobile}>
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
        {isMobile && (
          <S.Item
            onClick={() => {
              setIsOpen(true);
            }}
            isMobile={isMobile}
            className="more">
            <span>{`+${references.length - 3}개 더`}</span>
          </S.Item>
        )}
        <ModalSheet isOpen={isOpen} setIsOpen={setIsOpen}>
          <S.SheetWrap>
            <S.SheetHeader>출처</S.SheetHeader>
            <S.SheetContent>
              {references.map((ref, idx) => (
                <>
                  <S.SheetItem key={idx}>
                    <div className="title">{`${idx + 1}. ${ref.title}`}</div>
                    <div className="desc">{ref.desc}</div>
                  </S.SheetItem>
                  <div className="driver" />
                </>
              ))}
            </S.SheetContent>
          </S.SheetWrap>
        </ModalSheet>
      </S.ItemWrap>
    </S.Container>
  );
}
