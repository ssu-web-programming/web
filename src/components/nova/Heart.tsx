import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import Heart_10credit from '../../img/nova/promotion/heart_10credit.svg';
import Heart_20credit from '../../img/nova/promotion/heart_20credit.svg';
import Heart_30credit from '../../img/nova/promotion/heart_30credit.svg';
import Heart_finish from '../../img/nova/promotion/Heart_finish.svg';
import Heart_Empty from '../../img/nova/promotion/heart_empty.svg';
import useOpenModal from '../hooks/nova/useOpenModal';

import { flex } from 'style/cssCommon';
import { useCallback, useEffect } from 'react';
import {
  IEventType,
  IPromotionUserInfo,
  setPromotionUserInfo,
  userInfoSelector
} from '../../store/slices/promotionUserInfo';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { apiWrapper } from '../../api/apiWrapper';
import { PROMOTION_USER_INFO } from '../../api/constant';
import { SplunkData } from 'api/usePostSplunkLog';

const Img = styled.img<{ size: FlattenSimpleInterpolation }>`
  ${flex}
  ${(props) => props.size}
  cursor: pointer;
`;

interface HeartProps {
  progress: number;
  iconWidth: number;
  iconHeight: number;
  isHeader?: boolean;
}

export const Heart = ({ progress, iconWidth, iconHeight, isHeader }: HeartProps) => {
  const userInfo: IPromotionUserInfo = useAppSelector(userInfoSelector);
  const dispatch = useAppDispatch();
  const openModal = useOpenModal();
  let splunk:
    | ((data: SplunkData) => Promise<Response | undefined>)
    | ((arg0: { dp: string; dt: string; el: string }) => void)
    | null = null;

  const initPromotionUserInfo = async () => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res, logger } = await apiWrapper().request(PROMOTION_USER_INFO, {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          type: eventType
        }),
        method: 'POST'
      });
      splunk = logger;
      const response = await res.json();
      if (response.success) {
        dispatch(setPromotionUserInfo(response.data.accurePromotionUser));
      }
    } catch (err) {
      console.error('Failed to initialize promotion user info', err);
    }
  };

  const handleOpenModal = useCallback(() => {
    initPromotionUserInfo();
    if (splunk) {
      splunk({
        dp: 'ai.nova',
        dt: 'lucky_event',
        el: isHeader ? 'top_heart_click' : 'first_heart_click'
      });
    }
    if (userInfo) {
      openModal(userInfo);
    }
  }, [userInfo, openModal]);

  if (!userInfo.idUser) {
    return null;
  }

  let imgSrc;
  if (userInfo.status === 'ALREADY_USED') {
    imgSrc = isHeader ? Heart_Empty : Heart_finish;
  } else {
    if (progress >= 0 && progress <= 10) {
      imgSrc = Heart_10credit;
    } else if (progress > 10 && progress <= 20) {
      imgSrc = Heart_20credit;
    } else if (progress > 20 && progress <= 30) {
      imgSrc = Heart_30credit;
    } else {
      imgSrc = Heart_30credit;
    }
  }

  const sizeStyle = css`
    width: ${isHeader && imgSrc === Heart_Empty ? '32px' : `${iconWidth}px`};
    height: ${isHeader && imgSrc === Heart_Empty ? '32px' : `${iconHeight}px`};
  `;

  return <Img src={imgSrc} alt="heart" size={sizeStyle} onClick={handleOpenModal} />;
};
