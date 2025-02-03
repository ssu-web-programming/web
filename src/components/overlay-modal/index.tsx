import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface OverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

interface ModalContentProps {
  width: string;
  height: string;
}

const OverlayModal: React.FC<OverlayModalProps> = ({
  isOpen,
  onClose,
  children,
  width = '500px',
  height = 'auto'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <ModalWrapper onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} width={width} height={height}>
        {children}
      </ModalContent>
    </ModalWrapper>,
    document.body
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<ModalContentProps>`
  background-color: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

export default OverlayModal;
