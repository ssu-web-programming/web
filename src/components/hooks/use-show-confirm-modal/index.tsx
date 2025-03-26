import React from 'react';
import { overlay } from 'overlay-kit';

import ConfirmModalContent, { ConfirmModalProps } from '../../confirm-modal';
import OverlayModal from '../../overlay-modal';

export default function useShowConfirmModal() {
  const showConfirmModal = async ({
    title,
    msg,
    onOk,
    onCancel,
    neverShowAgain = false,
    cookieName
  }: ConfirmModalProps) => {
    overlay.closeAll();
    return await overlay.openAsync(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={() => close(false)}>
          <ConfirmModalContent
            title={title}
            msg={msg}
            onOk={{
              text: onOk?.text || '',
              handleOk: () => {
                onOk?.handleOk();
                close(true);
              }
            }}
            {...(onCancel && {
              onCancel: {
                text: onCancel.text || '',
                handleCancel: () => {
                  onCancel.handleCancel();
                  close(false);
                }
              }
            })}
            neverShowAgain={neverShowAgain}
            cookieName={cookieName}
          />
        </OverlayModal>
      );
    });
  };

  return showConfirmModal;
}
