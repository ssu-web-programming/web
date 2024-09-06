import { lazy } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { modalSelector } from '../../../store/slices/askDocModalsSlice';
import { useAppSelector } from '../../../store/store';

const MODAL_POMPONENTS = {
  upgrade: lazy(() => import('./UpgradePlanModal')),
  overpage: lazy(() => import('./OverPageErrorModal')),
  remine: lazy(() => import('./RemineDocumentModal')),
  samefile: lazy(() => import('./RemineDocumentModal')),
  analyzefail: lazy(() => import('./AnalyzeFailModal')),
  uploadfail: lazy(() => import('./UploadFailModal')),
  lackOfCredit: lazy(() => import('./CreditCheckModal')),
  default: lazy(() => import('./DefaultErrorModal'))
};

const Modals = () => {
  const modalList = useAppSelector(modalSelector);
  const renderModal = modalList.map(({ type, props }) => {
    const ModalComponent = MODAL_POMPONENTS[type] as any;
    return (
      <Overlay key={type}>
        <ModalWrapp>
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
`;

const ModalWrapp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;
