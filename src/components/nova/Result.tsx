import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CheckIcon from '../../img/nova/check_purple.png';

import GoBackHeader from './GoBackHeader';

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Guide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Title = styled.div`
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  span {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: #26282b;
  }
`;

const Desc = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #454c53;
`;

export default function Result() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <GoBackHeader />
      <Body>
        <Guide>
          <Title>
            <img src={CheckIcon} alt="check" />
            <span>배경 제거 완료</span>
          </Title>
          <Desc>배경 제거가 성공적으로 되었어요.</Desc>
        </Guide>
      </Body>
    </Wrap>
  );
}
