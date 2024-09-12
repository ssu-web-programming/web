import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ArrowIcon from '../../../img/nova/promotion/arrow_right.svg';
import Credit from '../../../img/nova/promotion/credit.svg';
import { IPromotionUserInfo, userInfoSelector } from '../../../store/slices/nova/promotionUserInfo';
import { useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';
import { Heart } from '../Heart';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 40px 12px 28px 12px;
  background-color: #fff;
  border-radius: 12px;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
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
`;

const ImageWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const CreditWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #f2f4f6;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #20075c;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    color: #9ea4aa;
    margin-left: 4px;
  }

  .highlight {
    font-size: 16px;
    font-weight: 700;
    color: #6f3ad0;
    margin: 0;
  }
`;

const Img = styled.img`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
  margin-top: 2px;
`;

const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

const LinkWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const Link = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  color: #6f3ad0;
  cursor: pointer;
`;

type Props = {
  buttonOnClick: () => void;
};

const PrizeCreditModal = ({ buttonOnClick }: Props) => {
  const userInfo: IPromotionUserInfo = useAppSelector(userInfoSelector);
  const { t } = useTranslation();

  const goStorePage = () => {
    Bridge.callBridgeApi('openWindow', 'https://polarisoffice.com/ko/promotion/festival#EV01');
    buttonOnClick();
  };

  return (
    <Wrap>
      <TextWrap>
        <Title>{t('Nova.Modal.NotEnoughHeart.Title')}</Title>
        <SubTitle>{t('Nova.Modal.NotEnoughHeart.SubTitle')}</SubTitle>
      </TextWrap>
      <ImageWrap>
        <Heart iconWidth={90} iconHeight={80} />
        <CreditWrap>
          <div>현재</div>
          <div>
            <span className="highlight">{userInfo.point}</span>
            <span>/30</span>
          </div>
          <Img src={Credit} alt="credit" width="20px" height="20px" />
        </CreditWrap>
      </ImageWrap>
      <ButtonWrap>
        <Button onClick={buttonOnClick}>
          <span>{t('Nova.Modal.NotEnoughHeart.ButtonText')}</span>
        </Button>
        <LinkWrap>
          <Link onClick={goStorePage}>{t('Nova.Modal.NotEnoughHeart.LinkText')}</Link>
          <Img src={ArrowIcon} alt="arrow" width="16px" height="24px" />
        </LinkWrap>
      </ButtonWrap>
    </Wrap>
  );
};

export default PrizeCreditModal;
