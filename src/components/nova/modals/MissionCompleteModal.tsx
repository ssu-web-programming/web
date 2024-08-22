import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import IPadIcon from '../../../img/nova/promotion/prize_ipad.svg';
import BuzIcon from '../../../img/nova/promotion/prize_buz.svg';
import AmericanoIcon from '../../../img/nova/promotion/prize_americano.svg';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 17px;
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
  width: 80px;
  height: 100px;
`;

type Props = {
  buttonOnclick: () => void;
};

const MissionCompleteModal = ({ buttonOnclick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.NeedCredit');
  return (
    <Wrap>
      <Text>
        <Title>{t('Nova.Modal.MissionComplete.Title')}</Title>
        <SubTitle>{t('Nova.Modal.MissionComplete.SubTitle')}</SubTitle>
        <ImgWrap>
          <Img src={IPadIcon} alt="IPad" />
        </ImgWrap>
      </Text>
    </Wrap>
  );
};

export default MissionCompleteModal;
