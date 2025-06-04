import React, { ReactElement, useEffect, useState } from 'react';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { iconMap } from '../../../../constants/serviceType';
import ArrowTooltips from '../../../arrowTooltip';
import NewBadge from '../../../new-badge';
import * as S from '../homeLayout/style';

type AIToolCardProps = {
  tab: NOVA_TAB_TYPE;
  isHighlight: boolean;
  icons: string[];
  label: ReactElement;
  handleClick: () => void;
};

const AIToolCard = ({ tab, isHighlight, icons, label, handleClick }: AIToolCardProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (icons.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [icons]);

  return (
    <S.ImageItemWrapper>
      {isHighlight ? (
        <ArrowTooltips
          autoClose={true}
          message={'일본 애니, 꾸러기 만화 등 다양한 스타일을 만나보세요!'}
          placement="top-start"
          cssExt={css`
            padding: 0;
          `}
          tooltipStyles={{ marginBottom: '12px !important' }}
          arrowStyles={{ transform: 'translate3d(16px, 0, 0) !important' }}>
          <S.HighlightWrap isHighlight={isHighlight} />
          <S.ImageItem onClick={handleClick} isHighlight={isHighlight}>
            {isHighlight && <NewBadge />}
            <img src={icons[index]} alt={tab} />
            <div className="title">{label}</div>
          </S.ImageItem>
        </ArrowTooltips>
      ) : (
        <>
          <S.HighlightWrap isHighlight={isHighlight} />
          <S.ImageItem onClick={handleClick} isHighlight={isHighlight}>
            <img src={icons[index]} alt={tab} />
            <div className="title">{label}</div>
          </S.ImageItem>
        </>
      )}
    </S.ImageItemWrapper>
  );
};

export default AIToolCard;
