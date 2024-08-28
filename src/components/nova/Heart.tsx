import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import Heart_10credit from '../../img/nova/promotion/heart_10credit.svg';
import Heart_20credit from '../../img/nova/promotion/heart_20credit.svg';
import Heart_30credit from '../../img/nova/promotion/heart_30credit.svg';
import Heart_finish from '../../img/nova/promotion/Heart_finish.svg';
import useOpenModal from '../hooks/nova/useOpenModal';

import { flex } from 'style/cssCommon';
import { useCallback } from 'react';
import { IPromotionUserInfo, userInfoSelector } from '../../store/slices/promotionUserInfo';
import { useAppSelector } from '../../store/store';

const Img = styled.img<{ size: FlattenSimpleInterpolation }>`
  ${flex}
  ${(props) => props.size}
  cursor: pointer;
`;

interface HeartProps {
  progress: number;
  iconWidth: number;
  iconHeight: number;
}

export const Heart = ({ progress, iconWidth, iconHeight }: HeartProps) => {
  const userInfo: IPromotionUserInfo = useAppSelector(userInfoSelector);
  const openModal = useOpenModal();

  const handleOpenModal = useCallback(() => {
    if (userInfo) {
      openModal(userInfo);
    }
  }, [userInfo, openModal]);

  if (!userInfo.idUser) {
    return null;
  }

  let imgSrc = '';
  if (progress >= 0 && progress <= 10) {
    imgSrc = Heart_10credit;
  } else if (progress > 10 && progress <= 20) {
    imgSrc = Heart_20credit;
  } else if (progress > 20 && progress <= 30) {
    imgSrc = Heart_30credit;
  } else {
    imgSrc = Heart_finish;
  }

  const sizeStyle = css`
    width: ${iconWidth}px;
    height: ${iconHeight}px;
  `;

  return <Img src={imgSrc} alt="heart" size={sizeStyle} onClick={handleOpenModal} />;
};
