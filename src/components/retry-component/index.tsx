import NovaHeader from 'components/nova/Header';
import CreditColorIcon from 'img/light/ico_credit_color_outline.svg';
import { useTranslation } from 'react-i18next';
import { clearError, errorSelector } from 'store/slices/errorSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled from 'styled-components';

import { ReactComponent as BangIcon } from '../../img/light/bang_circle.svg';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  background-color: rgb(244, 246, 248);
`;

const ContentContainer = styled.div`
  flex: 1; // 남은 공간 모두 차지
  overflow-y: auto; // 내용이 많을 경우 스크롤 가능
  display: flex;
  flex-direction: column;
`;
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
`;

const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  white-space: break-spaces;
  color: #454c53;
  white-space: pre-wrap;
`;

const ButtonWrap = styled.div`
  width: 100%;
  height: 48px;
  min-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  background: #6f3ad0;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }

  img {
    position: absolute;
    right: 12px;
  }
`;

export default function RetryComponent() {
  const { isError, errorTitle, onRetry } = useAppSelector(errorSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  if (!isError) return null;

  const handleRetry = () => {
    dispatch(clearError()); // 에러 상태 초기화
    onRetry?.(); // onRetry 함수 실행
  };

  return (
    <Container>
      <NovaHeader />
      <ContentContainer>
        <Wrap>
          <ContentWrap>
            <BangIcon />
            <Title>{errorTitle}</Title>
          </ContentWrap>
          {onRetry && (
            <ButtonWrap onClick={handleRetry}>
              <span>{t('Nova.TimeOut.Retry')}</span>
              <img src={CreditColorIcon} alt="credit" />
            </ButtonWrap>
          )}
        </Wrap>
      </ContentContainer>
    </Container>
  );
}
