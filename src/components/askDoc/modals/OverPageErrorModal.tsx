import { useTranslation } from 'react-i18next';
import { ReactComponent as Icon } from '../../../img/askDoc/ico_document_64.svg';
import ErrorModal from './ErrorModal';
type Props = {
  buttonOnclick: () => void;
};
const OverPageErrorModal = ({ buttonOnclick }: Props) => {
  const { t } = useTranslation();
  const text = t('AskDocStep.Modal.Under300');
  return (
    <ErrorModal
      title="문서를 다시 확인해주세요."
      isTwoButton={false}
      buttonName="닫기"
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

export default OverPageErrorModal;
