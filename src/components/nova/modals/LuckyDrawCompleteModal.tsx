import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import NovaIcon from '../../../img/nova/promotion/Nova3d.svg';

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 40px 30px 28px;
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
  white-space: break-spaces;
  text-align: center;
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

const LuckyDrawCompleteModal = ({ buttonOnClick }: Props) => {
  const { t } = useTranslation();
  const title = t('Nova.Modal.LuckyDrawComplete.Title');
  const subTitle = t('Nova.Modal.LuckyDrawComplete.SubTitle');

  return (
    <Wrap>
      <Text>
        <Title dangerouslySetInnerHTML={{ __html: title }} />
        <SubTitle dangerouslySetInnerHTML={{ __html: subTitle }} />
      </Text>
      <Button onClick={buttonOnClick}>
        <span>{t('Nova.Modal.LuckyDrawComplete.ButtonText')}</span>
      </Button>
    </Wrap>
  );
};

export default LuckyDrawCompleteModal;
