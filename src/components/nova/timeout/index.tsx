import React from 'react';
import CreditColorIcon from 'img/light/ico_credit_color_outline.svg';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { ReactComponent as BangIcon } from '../../../img/light/bang_circle.svg';
import {
  selectPageResult,
  selectPageService,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useGenerateStyleStudio } from '../../hooks/nova/use-generate-style-studio';
import { useChangeBackground } from '../../hooks/nova/useChangeBackground';
import { useChangeStyle } from '../../hooks/nova/useChangeStyle';
import { useConvert2DTo3D } from '../../hooks/nova/useConvert2DTo3D';
import { useExpandImage } from '../../hooks/nova/useExpandImage';
import { useImprovedResolution } from '../../hooks/nova/useImprovedResolution';
import { useRemakeImage } from '../../hooks/nova/useRemakeImage';
import { useRemoveBackground } from '../../hooks/nova/useRemoveBackground';

import * as S from './style';

export default function TimeOut() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const { handleConver2DTo3D } = useConvert2DTo3D();
  const { handleRemoveBackground } = useRemoveBackground();
  const { handleChangeBackground } = useChangeBackground();
  const { handleRemakeImage } = useRemakeImage();
  const { handleExpandImage } = useExpandImage();
  const { handleImprovedResolution } = useImprovedResolution();
  const { handleChangeStyle } = useChangeStyle();
  const { handleGenerateStyle } = useGenerateStyleStudio();

  const handleRetry = async () => {
    switch (selectedNovaTab) {
      case NOVA_TAB_TYPE.styleStudio:
        await handleGenerateStyle(result?.info.style, result?.info.prompt);
        break;
      case NOVA_TAB_TYPE.convert2DTo3D:
        await handleConver2DTo3D(result?.info.pattern, result?.info.animationType);
        break;
      case NOVA_TAB_TYPE.removeBG:
        await handleRemoveBackground();
        break;
      case NOVA_TAB_TYPE.changeBG:
        await handleChangeBackground(result?.info);
        break;
      case NOVA_TAB_TYPE.remakeImg:
        await handleRemakeImage();
        break;
      case NOVA_TAB_TYPE.expandImg:
        await handleExpandImage(
          result?.info.extend_left,
          result?.info.extend_right,
          result?.info.extend_up,
          result?.info.extend_down
        );
        break;
      case NOVA_TAB_TYPE.improvedRes:
        await handleImprovedResolution();
        break;
      case NOVA_TAB_TYPE.changeStyle:
        await handleChangeStyle(result?.info);
        break;
      case NOVA_TAB_TYPE.aiVideo:
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'loading' }));
        break;
      default:
        return async () => {};
    }
  };

  return (
    <S.Container>
      <S.Wrap>
        <S.ContentWrap>
          <BangIcon />
          <S.Title>{t(`Nova.TimeOut.Title`)}</S.Title>
        </S.ContentWrap>
        <S.ButtonWrap onClick={handleRetry}>
          <span>{t(`Nova.TimeOut.Retry`)}</span>
          <div>
            <img src={CreditColorIcon} alt="credit" />
            <span>{service[0].deductCredit}</span>
          </div>
        </S.ButtonWrap>
      </S.Wrap>
    </S.Container>
  );
}
