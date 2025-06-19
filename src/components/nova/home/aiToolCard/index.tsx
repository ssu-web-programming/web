import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
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
  const { t } = useTranslation();
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
          autoClose={false}
          message={t('Nova.styleStudio.Tooltip')}
          placement="top-start"
          cssExt={css`
            padding: 0;
            height: 100%;
          `}
          tooltipStyles={{ marginBottom: '12px !important' }}
          arrowStyles={{ transform: 'translate3d(16px, 0, 0) !important' }}>
          <S.HighlightWrap isHighlight={isHighlight} />
          <S.ImageItem onClick={handleClick} isHighlight={isHighlight}>
            {isHighlight && <NewBadge />}
            <img src={icons[index]} alt={tab} />
            <span className="title">{label}</span>
          </S.ImageItem>
        </ArrowTooltips>
      ) : (
        <>
          <S.HighlightWrap isHighlight={isHighlight} />
          <S.ImageItem onClick={handleClick} isHighlight={isHighlight}>
            <img src={icons[index]} alt={tab} />
            <span className="title">{label}</span>
          </S.ImageItem>
        </>
      )}
    </S.ImageItemWrapper>
  );
};

export default AIToolCard;
