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
import { getLangCodeFromParams, getLangCodeFromUA, LANG_KO_KR } from '../../locale';
export const ConfirmDoc = () => {
  const { t } = useTranslation();
  const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
  const isLangKo = paramLang?.includes(LANG_KO_KR);
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
          {isLangKo ? (
            <>
              <Icon iconSrc={Logo} size="sm" />
              <b> Polaris Drive </b>
              <p>{t('AskDocStep.Step2.SubText')}</p>
            </>
          ) : (
            <>
              <p>{t('AskDocStep.Step2.SubText1')}</p>
              <Icon iconSrc={Logo} size="sm" />
              <b> Polaris Drive. </b>
              <p>{t('AskDocStep.Step2.SubText2')}</p>
            </>
          )}
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 14px;

  img {
    margin-top: 2px;
  }

  b {
    color: #6f3ad0;
  }
`;
