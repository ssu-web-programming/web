import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Credit from '../../../img/nova/promotion/credit.gif';
import ArrowIcon from '../../../img/nova/promotion/arrow_right.svg';
import Bridge from '../../../util/bridge';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 12px 28px 12px;
  background-color: #fff;
  border-radius: 12px;
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
  margin-top: 12px;
`;

const Img = styled.img`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
`;

const Desc = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: #9ea4aa;
  margin-top: 4px;
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
  margin-top: 16px;

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
  margin-top: 8px;
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
  const { t } = useTranslation();

  const goStorePage = () => {
    Bridge.callBridgeApi('openWindow', 'https://polarisoffice.com/ko/promotion/festival#EV01');
  };

  return (
    <Wrap>
      <Title>{t('Nova.Modal.PrizeCredit.Title')}</Title>
      <SubTitle>{t('Nova.Modal.PrizeCredit.SubTitle')}</SubTitle>
      <Desc>{t('Nova.Modal.PrizeCredit.Desc')}</Desc>
      <Img src={Credit} alt="credit" width="225px" height="150px" />
      <Button onClick={buttonOnClick}>
        <span>{t('Nova.Modal.PrizeCredit.ButtonText')}</span>
      </Button>
      <LinkWrap>
        <Link onClick={goStorePage}>{t('Nova.Modal.PrizeCredit.LinkText')}</Link>
        <Img src={ArrowIcon} alt="arrow" width="16px" height="24px" />
      </LinkWrap>
    </Wrap>
  );
};

export default PrizeCreditModal;
