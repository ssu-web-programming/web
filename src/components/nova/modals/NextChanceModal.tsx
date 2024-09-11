import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import NovaIcon from '../../../img/nova/promotion/Nova3d.svg';
import Bridge from '../../../util/bridge';

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

const Img = styled.img`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
`;

const Desc = styled.li`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: #9ea4aa;
`;

const ButtonWrap = styled.div`
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
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

const NextChanceModal = ({ buttonOnClick }: Props) => {
  const { t } = useTranslation();
  const text = t('Nova.Modal.NextChance.Desc');

  const goEventPage = () => {
    buttonOnClick();
    Bridge.callBridgeApi('openWindow', 'https://polarisoffice.com/ko/promotion/festival');
  };

  return (
    <Wrap>
      <Text>
        <Title>{t('Nova.Modal.NextChance.Title')}</Title>
        <SubTitle>{t('Nova.Modal.NextChance.SubTitle')}</SubTitle>
      </Text>
      <Img src={NovaIcon} alt="nova" />
      <ButtonWrap>
        <ul>
          <Desc dangerouslySetInnerHTML={{ __html: text }}></Desc>
        </ul>
        <Button onClick={goEventPage}>
          <span>{t('Nova.Modal.NextChance.ButtonText')}</span>
        </Button>
      </ButtonWrap>
    </Wrap>
  );
};

export default NextChanceModal;
