import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_credit_64.svg';
import ErrorModal from './ErrorModal';

type Props = {
  leftButtonOnClick: () => void;
  rightButtonOnClick: () => void;
};

const CreditCheckModal = ({ leftButtonOnClick, rightButtonOnClick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.NeedCredit');
  return (
    <ErrorModal
      title={t('AskDocStep.Modal.CheckCredit')}
      isTwoButton={true}
      leftButtonName={t('AskDocStep.Modal.UpgradePlan')}
      leftButtonOnClick={leftButtonOnClick}
      rightButtonName={t('AskDocStep.Modal.Close')}
      rightButtonOnClick={rightButtonOnClick}>
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
