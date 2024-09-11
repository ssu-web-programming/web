import { useTranslation } from 'react-i18next';

import { ReactComponent as Icon } from '../../../img/askDoc/ico_document_64.svg';

import ErrorModal from './ErrorModal';

type Props = {
  buttonOnclick: () => void;
};

const AnalyzeFailModal = ({ buttonOnclick }: Props) => {
  const { t } = useTranslation();
  const textData = t('AskDocStep.Modal.FailedAnalyze');
  return (
    <ErrorModal
      title={t('AskDocStep.Modal.FailAnalyze')}
      isTwoButton={false}
      buttonName={t('AskDocStep.Modal.AgainAnalyze')}
      buttonOnClick={buttonOnclick}>
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
