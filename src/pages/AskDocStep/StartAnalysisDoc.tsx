import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import AskDocButton from '../../components/buttons/AskDocButton';
import useLangParameterNavigate from '../../components/hooks/useLangParameterNavigate';
import Icon from '../../components/Icon';
import Credit, { ReactComponent as IconCredit } from '../../img/light/ico_credit.svg';
import { Footer, GuideMessage, Wrapper } from '../../style/askDoc';

export const StartAnalysisDoc = () => {
  const { t } = useTranslation();
  const { navigate } = useLangParameterNavigate();

  const handleClick = () => {
    navigate('/AskDocStep/ProgressAnalysisDoc');
  };

  return (
    <Wrapper background={false}>
      <Helmet>
        <title>StartAnalysisDoc</title>
      </Helmet>
      <GuideMessage>
        <h1>{t('AskDocStep.Step3.MainText')}</h1>
        <SubText>
          <span>{t('AskDocStep.Step3.SubText1')}</span>
          <Highlight>
            <Icon iconSrc={Credit} size="sm" />
            <strong>{`${t('AskDocStep.Step3.Credit', { credit: 5 })},`}</strong>
          </Highlight>
          {t('AskDocStep.Step3.SubText2')}
          <Highlight>
            <Icon iconSrc={Credit} size="sm" />
            <strong>{`${t('AskDocStep.Step3.Credit', { credit: 4 })}`}</strong>
          </Highlight>
          {t('AskDocStep.Step3.SubText3')}
        </SubText>
      </GuideMessage>
      <Footer className="analyze_btn">
        <AskDocButton
          text={t('AskDocStep.Step3.ButtonText')}
          onClick={handleClick}
          iconComponent={IconCredit}></AskDocButton>
      </Footer>
    </Wrapper>
  );
};

export default StartAnalysisDoc;

const SubText = styled.div`
  line-height: 21px;
  font-size: 14px;
`;

const Highlight = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  gap: 0 4px;
  line-height: 21px;
  position: relative;
  bottom: -2px;

  img {
    position: relative;
    bottom: -1px;
  }

  strong {
    color: var(--ai-purple-50-main);
  }
`;
