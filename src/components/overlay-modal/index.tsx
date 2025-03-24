import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

interface OverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  cssExt?: FlattenSimpleInterpolation;
  closeOnOutsideClick?: boolean;
}

const OverlayModal: React.FC<OverlayModalProps> = ({
  isOpen,
  onClose,
  children,
  cssExt,
  closeOnOutsideClick = false
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

  const handleWrapperClick = () => {
    if (closeOnOutsideClick) {
      onClose();
    }
  };

  return createPortal(
    <ModalWrapper onClick={handleWrapperClick}>
      <ModalContent onClick={(e) => e.stopPropagation()} cssExt={cssExt}>
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

const ModalContent = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  position: relative;
  background: ${({ theme }) => theme.color.background.gray05};
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: auto;
  max-width: 90%;
  max-height: 90vh;
  padding: 24px;
  overflow-y: auto;

  ${(props) => props.cssExt || ''};
`;

export default OverlayModal;
