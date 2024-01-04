import { useTranslation } from 'react-i18next';
import { Footer, GuideMessage, Wrapper } from '../../style/askDoc';
import Loading from '../../components/Loading';
import { useState } from 'react';
import CreateVector from '../../components/askDoc/analyzeStep/CreateVector';
import Keyword from '../../components/askDoc/analyzeStep/Keyword';
import PreAsk from '../../components/askDoc/analyzeStep/PresAsk';
import { useAppSelector } from '../../store/store';
import { IFileStatus, filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';

export const ProgressAnalysisDoc = () => {
  const { t } = useTranslation();

  const { fileStatus } = useAppSelector(filesSelector);

  const [step, setStep] = useState<IFileStatus | 'ready'>(fileStatus);

  const getLoadingText = () => {
    if (step === 'TEXT_DONE') return t('AskDocStep.Step4.Loading_AnalyzeDoc');
    if (step === 'ANALYZE_DONE') return t('AskDocStep.Step4.Loading_Keyword');
    if (step === 'DOCINFO_DONE') return t('AskDocStep.Step4.Loading_Done');
  };

  return (
    <Wrapper background={false}>
      <GuideMessage>
        <h1>{t('AskDocStep.Step4.MainText')}</h1>
      </GuideMessage>
      <Loading>{getLoadingText()}</Loading>
      <Footer>
        {step === 'TEXT_DONE' && <CreateVector onNext={setStep} />}
        {step === 'ANALYZE_DONE' && <Keyword onNext={setStep} />}
        {(step === 'DOCINFO_DONE' || step === 'USECREDIT_REQUIRED') && <PreAsk onNext={setStep} />}
      </Footer>
    </Wrapper>
  );
};

export default ProgressAnalysisDoc;
