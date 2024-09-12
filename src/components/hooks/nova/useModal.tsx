import { closeModal, openModal } from '../../../store/slices/nova/novaModalsSlice';
import { useAppDispatch } from '../../../store/store';

function useModal() {
  const dispatch = useAppDispatch();

  const handleOpenModal = ({ type, props }: any) => {
    dispatch(openModal({ type, props }));
  };

  const handleCloseModal = (type: any) => {
    dispatch(closeModal(type));
  };

  return { openModal: handleOpenModal, closeModal: handleCloseModal };
}

export default useModal;
