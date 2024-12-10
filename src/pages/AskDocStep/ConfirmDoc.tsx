import { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import useLangParameterNavigate from '../../components/hooks/useLangParameterNavigate';
import usePercentage from '../../components/hooks/usePercentage';
import usePollingExtractText from '../../components/hooks/usePollingExtractText';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import ProgressBar from '../../components/ProgressBar';
import Logo from '../../img/light/askDoc/ico_polaris_logo.svg';
import { Footer, GuideMessage, Wrapper } from '../../style/askDoc';

export const ConfirmDoc = () => {
  const { t } = useTranslation();
  const { navigate } = useLangParameterNavigate();
  const { isSuccess, isLoading } = usePollingExtractText();
  const { percentage } = usePercentage(isLoading, isSuccess);

  useLayoutEffect(() => {
    if (isSuccess && percentage === 100) {
      navigate('/AskDocStep/StartAnalysisDoc');
    }
  }, [isSuccess, percentage, navigate]);

  const mergeTransComponent = (text: string, opt: { from: string; to: React.ReactElement }) => {
    const split = text.split(`{{${opt.from}}}`);
    return (
      <>
        {split.map((t, i) =>
          i < split.length - 1 ? (
            <>
              {`${t}`}
              {opt.to}
            </>
          ) : (
            t
          )
        )}
      </>
    );
  };

  const subText = mergeTransComponent(t('AskDocStep.Step2.SubText'), {
    from: 'drive',
    to: (
      <div style={{ display: 'inline-block' }}>
        <Icon iconSrc={Logo} size="sm" />
        <b>Polaris Drive</b>
      </div>
    )
  });

  return (
    <Wrapper background={false}>
      <Helmet>
        <title>ConfirmDoc</title>
      </Helmet>
      <GuideMessage>
        <h1>{t('AskDocStep.Step2.MainText')}</h1>
        <SubText>
          <div>{subText}</div>
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
  font-size: 14px;

  img {
    float: left;
    margin-top: 2px;
  }

  b {
    padding-left: 4px;
    color: #6f3ad0;
  }
`;
