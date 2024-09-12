import { useState } from 'react';
import { SplunkData } from 'api/usePostSplunkLog';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { apiWrapper } from '../../../api/apiWrapper';
import { PROMOTION_OFFER, PROMOTION_USER_INFO } from '../../../api/constant';
import AmericanoIcon from '../../../img/nova/promotion/prize_americano_with_back.svg';
import BuzIcon from '../../../img/nova/promotion/prize_buz_with_back.svg';
import IPadIcon from '../../../img/nova/promotion/prize_ipad_with_back.svg';
import Roulette from '../../../img/nova/promotion/slot.gif';
import {
  IAccurePromotionAction,
  IEventType,
  setPromotionUserInfo
} from '../../../store/slices/nova/promotionUserInfo';
import useModal from '../../hooks/nova/useModal';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 17px;
  padding: 40px 12px 28px 12px;
  background-color: #fff;
  border-radius: 12px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  color: #3e0f8d;
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #454c53;
  white-space: break-spaces;
  text-align: center;
`;

const ImgWrap = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Img = styled.img`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
`;

const Desc = styled.li`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: #9ea4aa;

  .highlight {
    font-weight: 700;
    color: #6f3ad0;
  }
`;

const Button = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  background-color: #6f3ad0;
  cursor: pointer;

  span {
    font-size: 18px;
    font-weight: 700;
    line-height: 18px;
    color: #fff;
  }
`;

type Props = {
  buttonOnClick: () => void;
};

const MissionCompleteModal = ({ buttonOnClick }: Props) => {
  const { t } = useTranslation();
  const [roulette, setRoulette] = useState(false);
  const { openModal, closeModal } = useModal();
  let splunk:
    | ((data: SplunkData) => Promise<Response | undefined>)
    | ((arg0: { dp: string; dt: string; el: string }) => void)
    | null = null;
  const text = t('Nova.Modal.MissionComplete.Desc');

  const handleClick = () => {
    setRoulette(true);

    const gifDuration = 4000;
    Promise.all([OfferEvent(), new Promise((resolve) => setTimeout(resolve, gifDuration))]).then(
      ([type]) => {
        buttonOnClick();

        if (type) {
          openModal({
            type: type,
            props: {
              buttonOnClick: async () => {
                closeModal(type);
                initPromotionUserInfo();
              }
            }
          });
        }
        if (splunk) {
          splunk({
            dp: 'ai.nova',
            dt: 'lucky_event',
            el: 'spin_roulette'
          });
        }
      }
    );
  };

  const initPromotionUserInfo = async () => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res } = await apiWrapper().request(PROMOTION_USER_INFO, {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          type: eventType
        }),
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        setPromotionUserInfo(response.data.accurePromotionUser);
      }
    } catch (err) {
      /* empty */
    }
  };

  const OfferEvent = async () => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res, logger } = await apiWrapper().request(PROMOTION_OFFER, {
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
        const accureAction =
          response.data.result.accrue?.length > 0
            ? response.data.result.accrue
            : IAccurePromotionAction.UNKNOWN;

        return accureAction === IAccurePromotionAction.UNKNOWN ? 'prizeCredit' : 'prize';
      }
    } catch (err) {
      console.error('OfferEvent error:', err);
      return null;
    }
  };

  return (
    <Wrap>
      <Text>
        <Title>{t('Nova.Modal.MissionComplete.Title')}</Title>
        <SubTitle>{t('Nova.Modal.MissionComplete.SubTitle')}</SubTitle>
      </Text>
      {roulette ? (
        <Img src={Roulette} alt="roulette" width="100%" height="100px" />
      ) : (
        <ImgWrap>
          <Img src={BuzIcon} alt="IPad" />
          <Img src={IPadIcon} alt="IPad" />
          <Img src={AmericanoIcon} alt="IPad" />
        </ImgWrap>
      )}
      <ul>
        <Desc dangerouslySetInnerHTML={{ __html: text }}></Desc>
      </ul>
      <Button onClick={handleClick}>
        <span>{t('Nova.Modal.MissionComplete.ButtonText')}</span>
      </Button>
    </Wrap>
  );
};

export default MissionCompleteModal;
