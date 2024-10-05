import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { modalSelector } from '../../../store/slices/nova/novaModalsSlice';
import { useAppSelector } from '../../../store/store';
import useModal from '../../hooks/nova/useModal';

const MODAL_POMPONENTS = {};

const Modals = () => {
  const modalList = useAppSelector(modalSelector);
  const { closeModal } = useModal();
  const renderModal = modalList.map(({ type, props }, index) => {
    return (
      <Overlay key={type || index}>
        <ModalWrap></ModalWrap>
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

const ModalWrap = styled.div`
  width: 340px;
  max-height: 100vh;
  position: relative;
  display: flex;
  box-sizing: border-box;
  overflow-y: auto;
  font-family: Pretendard, sans-serif !important;
`;

const Close = styled.img`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
`;
