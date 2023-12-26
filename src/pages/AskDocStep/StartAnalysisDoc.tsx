import { Wrapper, GuideMessage, Footer } from '../../style/askDoc';
import { useTranslation } from 'react-i18next';
import { ReactComponent as IconCredit } from '../../img/ico_credit.svg';
import AskDocButton from '../../components/buttons/AskDocButton';
import Credit from '../../img/ico_credit.svg';
import Icon from '../../components/Icon';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const StartAnalysisDoc = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();

  const handleClick = () => {
    navigator('/AskDocStep/ProgressAnalysisDoc?lang=ko');
  };

  return (
    <Wrapper background={false}>
      <GuideMessage>
        <h1>{t('AskDocStep.Step3.MainText')}</h1>
        <SubText>
          <span>{t('AskDocStep.Step3.SubText1')}</span>
          <Highlight>
            <Icon iconSrc={Credit} size="sm" />
            <strong> 5 크레딧</strong>
          </Highlight>
          {t('AskDocStep.Step3.SubText2')}
          <Highlight>
            <Icon iconSrc={Credit} size="sm" />
            <strong> 4 크레딧</strong>
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
  span {
    line-height: 21px;
  }
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
