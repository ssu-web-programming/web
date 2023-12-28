import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_crown_64.svg';
import ErrorModal from './ErrorModal';

type Props = {
  leftButtonOnClick: () => void;
  rightButtonOnClick: () => void;
};

const UpgradePlanModal = ({ leftButtonOnClick, rightButtonOnClick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.LackUsage');

  return (
    <ErrorModal
      title="요금제를 업그레이드 해보세요."
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

export default UpgradePlanModal;
