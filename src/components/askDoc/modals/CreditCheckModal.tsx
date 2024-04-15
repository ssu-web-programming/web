import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_credit_64.svg';
import ErrorModal from './ErrorModal';

type Props = {
  buttonOnClick: () => void;
};

const CreditCheckModal = ({ buttonOnClick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.NeedCredit');
  return (
    <ErrorModal
      title={t('AskDocStep.Modal.CheckCredit')}
      isTwoButton={false}
      buttonName={t('AskDocStep.Modal.Close')}
      buttonOnClick={buttonOnClick}>
      <>
        <p dangerouslySetInnerHTML={{ __html: text }}></p>
        <div className="imgWrapp">
          <Icon />
        </div>
      </>
    </ErrorModal>
  );
};

export default CreditCheckModal;
