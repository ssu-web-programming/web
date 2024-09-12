import { useCallback, useMemo } from 'react';
import { SplunkData } from 'api/usePostSplunkLog';
import { flex } from 'style/cssCommon';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import { apiWrapper } from '../../api/apiWrapper';
import { PROMOTION_USER_INFO } from '../../api/constant';
import Heart_10credit from '../../img/nova/promotion/heart_10credit.svg';
import Heart_20credit from '../../img/nova/promotion/heart_20credit.svg';
import Heart_30credit from '../../img/nova/promotion/heart_30credit.svg';
import Heart_Empty from '../../img/nova/promotion/heart_empty.svg';
import Heart_finish from '../../img/nova/promotion/Heart_finish.svg';
import LoadingSpinner from '../../img/nova/promotion/loading_spiner.gif';
import {
  IEventType,
  IPromotionUserInfo,
  setPromotionUserInfo,
  userInfoSelector
} from '../../store/slices/nova/promotionUserInfo';
import { useAppDispatch, useAppSelector } from '../../store/store';
import useOpenModal from '../hooks/nova/useOpenModal';

const Img = styled.img<{ size: FlattenSimpleInterpolation }>`
  ${flex};
  ${(props) => props.size};
  cursor: pointer;
`;

interface HeartProps {
  iconWidth: number;
  iconHeight: number;
  isHeader?: boolean;
}

export const Heart = ({ iconWidth, iconHeight, isHeader }: HeartProps) => {
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
      if (splunk) {
        splunk({
          dp: 'ai.nova',
          dt: 'lucky_event',
          el: isHeader ? 'top_heart_click' : 'first_heart_click'
        });
      }

      const response = await res.json();
      if (response.success) {
        dispatch(setPromotionUserInfo(response.data.accurePromotionUser));
      }
    } catch (err) {
      console.error('Failed to initialize promotion user info', err);
    }
  };

  const handleOpenModal = useCallback(() => {
    if (userInfo.point < 0) return;

    initPromotionUserInfo();
    if (userInfo) {
      openModal(userInfo);
    }
  }, [userInfo, openModal]);

  const imgSrc = useMemo(() => {
    if (userInfo.status === 'ALREADY_USED') {
      return isHeader ? Heart_Empty : Heart_finish;
    } else if (userInfo.status === 'NO_AGREEMENT_DATA') {
      return Heart_30credit;
    }

    if (userInfo.point >= 0 && userInfo.point <= 15) {
      return Heart_10credit;
    } else if (userInfo.point > 15 && userInfo.point <= 29) {
      return Heart_20credit;
    } else if (userInfo.point >= 30) {
      return Heart_30credit;
    } else if (isHeader) {
      return Heart_Empty;
    } else {
      return LoadingSpinner;
    }
  }, [userInfo, isHeader]);

  const sizeStyle = useMemo(
    () => css`
      width: ${imgSrc === Heart_Empty ? '32px' : `${iconWidth}px`};
      height: ${imgSrc === Heart_Empty ? '32px' : `${iconHeight}px`};
      transform: ${imgSrc === LoadingSpinner ? 'scale(0.5)' : 'none'};
    `,
    [imgSrc, iconWidth, iconHeight]
  );

  return <Img src={imgSrc} alt="heart" size={sizeStyle} onClick={handleOpenModal} />;
};
