import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_document_64.svg';
import ErrorModal from './ErrorModal';

type Props = {
  buttonOnclick: () => void;
};

const RemineDocumentModal = ({ buttonOnclick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.Over1000');

  return (
    <ErrorModal
      title={t('AskDocStep.Modal.CheckDocument')}
      isTwoButton={false}
      buttonName={t('AskDocStep.Modal.Close')}
      buttonOnClick={buttonOnclick}>
      <>
        <p dangerouslySetInnerHTML={{ __html: text }}></p>
        <div className="imgWrapp">
          <Icon />
        </div>
      </>
    </ErrorModal>
  );
};

export default RemineDocumentModal;
