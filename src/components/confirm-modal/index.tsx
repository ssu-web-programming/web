import React, { useEffect } from 'react';
import { overlay } from 'overlay-kit';
import { css } from 'styled-components';

import Button from '../buttons/Button';

import * as S from './style';

export interface ConfirmModalProps {
  title?: string;
  msg?: string;
  onOk?: { text: string; handleOk: () => void };
  onCancel?: { text: string; handleCancel: () => void };
  neverShowAgain?: boolean;
  cookieName?: string;
}

export default function ConfirmModalContent({
  title,
  msg,
  onOk,
  onCancel,
  neverShowAgain = false,
  cookieName
}: ConfirmModalProps) {
  const handleOk = () => {
    overlay.closeAll();
    if (onOk) onOk.handleOk();
  };

  const handleCancle = () => {
    overlay.closeAll();
    if (onCancel) onCancel.handleCancel();
  };

  return (
    <>
      <S.ModalContainer>
        <S.Content>
          {title && <S.Title>{title}</S.Title>}
          {msg && <S.Message>{msg}</S.Message>}
        </S.Content>
        <S.ButtonGroup>
          {onCancel && (
            <Button
              variant="gray"
              width={'full'}
              height={48}
              onClick={handleCancle}
              cssExt={css`
                min-width: 92px;
                width: 100%;
                border-radius: 8px;
                line-height: 19px;
                font-weight: 500;
                flex: 1;
              `}>
              {onCancel.text}
            </Button>
          )}
          <Button
            variant="purple"
            width={'full'}
            height={48}
            onClick={handleOk}
            cssExt={css`
              min-width: 92px;
              width: 100%;
              border-radius: 8px;
              line-height: 19px;
              font-weight: 500;
              flex: 2;
            `}>
            {onOk?.text}
          </Button>
        </S.ButtonGroup>
      </S.ModalContainer>
    </>
  );
}
