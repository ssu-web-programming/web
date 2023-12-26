import { ReactComponent as Icon } from '../../../img/askDoc/ico_document_64.svg';
import ErrorModal from './ErrorModal';
import { useTranslation } from 'react-i18next';

type Props = {
  buttonOnClick: () => void;
};

const AnalyzeFailModal = ({ buttonOnClick }: Props) => {
  const { t } = useTranslation();
  const textData = t('AskDocStep.Modal.FailedAnalyze');
  return (
    <ErrorModal
      title={t('AskDocStep.Modal.FailAnalyze')}
      isTwoButton={false}
      buttonName={t('AskDocStep.Modal.AgainAnalyze')}
      buttonOnClick={buttonOnClick}>
      <>
        <p dangerouslySetInnerHTML={{ __html: textData }}></p>
        <div className="imgWrapp">
          <Icon />
        </div>
      </>
    </ErrorModal>
  );
};

export default AnalyzeFailModal;
