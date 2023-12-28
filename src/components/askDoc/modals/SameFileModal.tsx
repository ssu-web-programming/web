import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_document_64.svg';
import ErrorModal from './ErrorModal';

type Props = {
  leftButtonOnClick: () => void;
  rightButtonOnClick: () => void;
};
const SameFileModal = ({ leftButtonOnClick, rightButtonOnClick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.SameNameInDrive');

  return (
    <ErrorModal
      title="같은 이름의 파일이 있어요."
      isTwoButton={true}
      leftButtonName={t('AskDocStep.Modal.CoverThisFile')}
      leftButtonOnClick={leftButtonOnClick}
      rightButtonName={t('AskDocStep.Modal.Ignore')}
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

export default SameFileModal;
