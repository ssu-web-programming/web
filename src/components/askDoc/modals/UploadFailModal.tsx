import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_document_64.svg';
import ErrorModal from './ErrorModal';

type Props = {
  leftButtonOnClick: () => void;
  rightButtonOnClick: () => void;
};

const UploadFailModal = ({ leftButtonOnClick, rightButtonOnClick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.UploadFail');

  return (
    <ErrorModal
      title="문서 업로드에 실패했어요."
      isTwoButton={true}
      leftButtonName={t('AskDocStep.Modal.TryAgain')}
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

export default UploadFailModal;
