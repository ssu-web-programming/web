import { Wrapper, GuideMessage, Footer } from '../../style/askDoc';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import Icon from '../../components/Icon';
import Logo from '../../img/askDoc/ico_polaris_logo.svg';
import styled from 'styled-components';
import { useLayoutEffect } from 'react';
import Loading from '../../components/Loading';
import { usePollingExtractText } from '../../components/hooks/useCreateVectorData';
import usePercentage from '../../components/hooks/usePercentage';
export const ConfirmDoc = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isSuccess, isLoading } = usePollingExtractText();
  const { percentage } = usePercentage(isLoading, isSuccess);

  useLayoutEffect(() => {
    if (isSuccess && percentage === 100) {
      navigate('/AskDocStep/StartAnalysisDoc');
    }
  }, [isSuccess, percentage, navigate]);

  return (
    <Wrapper background={false}>
      <GuideMessage>
        <h1>{t('AskDocStep.Step2.MainText')}</h1>
        <SubText>
          <Icon iconSrc={Logo} size="sm" />
          <p>
            <b> Polaris Drive </b>
            {t('AskDocStep.Step2.SubText')}
          </p>
        </SubText>
      </GuideMessage>
      {percentage > 90 && <Loading>{t('AskDocStep.Step2.LoadingText')}</Loading>}
      <Footer>
        <ProgressBar progressPer={percentage} />
      </Footer>
    </Wrapper>
  );
};

export default ConfirmDoc;

const SubText = styled.div`
  img {
    float: left;
    margin-top: 2px;
  }

  b {
    padding-left: 4px;
  }
`;
