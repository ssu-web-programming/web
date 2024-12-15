import React from 'react';
import CreditColorIcon from 'img/light/ico_credit_color_outline.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ReactComponent as BangIcon } from '../../img/light/bang_circle.svg';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useChangeBackground } from '../hooks/nova/useChangeBackground';
import { useChangeStyle } from '../hooks/nova/useChangeStyle';
import { useConvert2DTo3D } from '../hooks/nova/useConvert2DTo3D';
import { useExpandImage } from '../hooks/nova/useExpandImage';
import { useImprovedResolution } from '../hooks/nova/useImprovedResolution';
import { useRemakeImage } from '../hooks/nova/useRemakeImage';
import { useRemoveBackground } from '../hooks/nova/useRemoveBackground';

import GoBackHeader from './GoBackHeader';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1 1 0;
  margin-bottom: 16px;
  overflow-y: auto;
  background-color: rgb(244, 246, 248);
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
`;

const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  white-space: break-spaces;
  color: #454c53;
`;

const ButtonWrap = styled.div`
  width: 100%;
  height: 48px;
  min-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  background: #6f3ad0;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }

  img {
    position: absolute;
    right: 12px;
  }
`;

export default function TimeOut() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { handleConver2DTo3D } = useConvert2DTo3D();
  const { handleRemoveBackground } = useRemoveBackground();
  const { handleChangeBackground } = useChangeBackground();
  const { handleRemakeImage } = useRemakeImage();
  const { handleExpandImage } = useExpandImage();
  const { handleImprovedResolution } = useImprovedResolution();
  const { handleChangeStyle } = useChangeStyle();
  const handleRetry = async () => {
    switch (selectedNovaTab) {
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
      default:
        return async () => {};
    }
  };

  return (
    <Container>
      <Wrap>
        <ContentWrap>
          <BangIcon />
          <Title>{t(`Nova.TimeOut.Title`)}</Title>
        </ContentWrap>
        <ButtonWrap onClick={handleRetry}>
          <span>{t(`Nova.TimeOut.Retry`)}</span>
          <img src={CreditColorIcon} alt="credit" />
        </ButtonWrap>
      </Wrap>
    </Container>
  );
}
