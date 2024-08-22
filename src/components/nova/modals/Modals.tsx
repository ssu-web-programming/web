import { lazy } from 'react';
import { useAppSelector } from '../../../store/store';
import { createPortal } from 'react-dom';
import { modalSelector } from '../../../store/slices/novaModalsSlice';
import styled from 'styled-components';
import CloseIcon from '../../../img/nova/promotion/close.svg';
import useModal from '../../hooks/useModal';

const MODAL_POMPONENTS = {
  missionComplete: lazy(() => import('./MissionCompleteModal'))
};

const Modals = () => {
  const modalList = useAppSelector(modalSelector);
  const { closeModal } = useModal();
  const renderModal = modalList.map(({ type, props }) => {
    const ModalComponent = MODAL_POMPONENTS[type];
    return (
      <Overlay>
        <ModalWrapp>
          <Close src={CloseIcon} alt="close" onClick={closeModal} />
          <ModalComponent key={type} {...props} />
        </ModalWrapp>
      </Overlay>
    );
  });
  return createPortal(<>{renderModal}</>, document.getElementById('modal') as Element);
};

export default Modals;

export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapp = styled.div`
  width: 340px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px 12px 28px 12px;
`;

const Close = styled.img`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
`;
