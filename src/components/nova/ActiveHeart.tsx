import styled from 'styled-components';
import Heart_Full from '../../img/nova/promotion/heart_full.svg';
import Heart_Empty from '../../img/nova/promotion/heart_empty.svg';

import { flex } from 'style/cssCommon';
import { useAppSelector } from '../../store/store';
import { IPromotionUserInfo, userInfoSelector } from '../../store/slices/promotionUserInfo';
import useModal from '../hooks/nova/useModal';
import { useState } from 'react';

const Img = styled.img`
  ${flex};
  cursor: pointer;
`;

export const ActiveHeart = () => {
  const userInfo: IPromotionUserInfo = useAppSelector(userInfoSelector);
  const { openModal, closeModal } = useModal();
  const [status, setStatus] = useState('');

  const onClickHeart = () => {
    // openModal({
    //   type: 'missionComplete',
    //   props: {
    //     buttonOnClick: () => {
    //       closeModal('missionComplete');
    //       openModal({
    //         type: 'prizeCredit',
    //         props: {
    //           buttonOnClick: () => {
    //             closeModal('prizeCredit');
    //           }
    //         }
    //       });
    //     }
    //   }
    // });
    // openModal({
    //   type: 'notEnoughHeart',
    //   props: {
    //     buttonOnClick: () => {
    //       closeModal('notEnoughHeart');
    //     }
    //   }
    // });
    // openModal({
    //   type: 'nextChance',
    //   props: {
    //     buttonOnClick: () => {
    //       closeModal('nextChance');
    //     }
    //   }
    // });
    openModal({
      type: 'prize',
      props: {
        buttonOnClick: () => {
          closeModal('prize');
          openModal({
            type: 'luckyDrawComplete',
            props: {
              buttonOnClick: () => {
                closeModal('luckyDrawComplete');
              }
            }
          });
        }
      }
    });
  };

  let imgSrc = Heart_Full;
  if (userInfo.status === 'VALID') {
    imgSrc = Heart_Full;
    if (userInfo.point >= 30) {
      setStatus('missionComplete');
    } else {
      setStatus('fillHeart');
    }
  } else if (userInfo.status === 'ALREADY_USED') {
    imgSrc = Heart_Empty;
    setStatus('alreadyUsed');
  } else if (userInfo.status === 'NO_AGREEMENT_DATA') {
    imgSrc = Heart_Empty;
  }

  return <Img src={imgSrc} alt="heart" onClick={onClickHeart} />;
};
