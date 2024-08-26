import { openModal, closeModal } from '../../../store/slices/askDocModalsSlice';
import { useAppDispatch } from '../../../store/store';

function useModal() {
  const dispatch = useAppDispatch();

  const handleOpenModal = ({ type, props }: any) => {
    dispatch(openModal({ type, props }));
  };

  const handleCloseModal = (type: any) => {
    dispatch(closeModal());
  };

  return { openModal: handleOpenModal, closeModal: handleCloseModal };
}

export default useModal;
