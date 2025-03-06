import React, { useState } from 'react';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { setCookie } from '../../util/common';
import Button from '../buttons/Button';
import CheckBox from '../checkbox';

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
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleOk = () => {
    if (isChecked) {
      setCookie(cookieName || 'creditGuide', String(isChecked));
    }

    overlay.closeAll();
    if (onOk) onOk.handleOk();
  };

  const handleCancle = () => {
    if (isChecked) {
      setCookie('creditGuide', String(isChecked));
    }

    overlay.closeAll();
    if (onCancel) onCancel.handleCancel();
  };

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <S.ModalContainer>
        <S.Content>
          {title && <S.Title>{title}</S.Title>}
          {msg && <S.Message>{msg}</S.Message>}
        </S.Content>
        <S.ButtonContainer>
          <S.ButtonWrap>
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
          </S.ButtonWrap>

          {neverShowAgain && (
            <S.CheckWrap onClick={handleCheck}>
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} isCircleBox={false} />
              <span>{t(`DontShowAgain`)}</span>
            </S.CheckWrap>
          )}
        </S.ButtonContainer>
      </S.ModalContainer>
    </>
  );
}
