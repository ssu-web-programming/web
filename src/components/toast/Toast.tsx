import { useCallback, useEffect, useRef } from 'react';
import PassDarkIcon from 'img/dark/ico_toast_completion.svg';
import WarningDarkIcon from 'img/dark/ico_toast_warning.svg';
import { ReactComponent as IconClose } from 'img/light/ico_ai_close.svg';
import PassLightIcon from 'img/light/ico_toast_completion.svg';
import WarningLightIcon from 'img/light/ico_toast_warning.svg';
import styled, { css, keyframes } from 'styled-components';

import { themeInfoSelector } from '../../store/slices/theme';
import { initToast, selectToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import IconButton from '../buttons/IconButton';
import Icon from '../Icon';

const Fade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const TIME = 500;

const ToastMsgWrapper = styled.div<{ variant: ToastType }>`
  display: flex;
  align-items: flex-start;
  flex-shrink: 1;
  flex-grow: 1;

  position: absolute;
  left: 50%;
  top: 92px;
  transform: translate(-50%, -50%);

  word-wrap: break-word;
  width: calc(100% - 32px);
  height: fit-content;
  border-radius: 10px;
  padding: 4px;
  animation: ${Fade} ${TIME}ms;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 var(--black-10);

  ${({ theme, variant }) => VARIANTS[variant](theme)}

  z-index: 200;
`;

const IconWrapper = styled.div`
  padding: 8px;
`;

const ToastText = styled.div`
  flex: 1;
  height: fit-content;
  padding: 8px 0;
  white-space: pre-wrap;
`;

const CloseWrapper = styled.div<{ type: ToastType }>`
  ${(props) =>
    props.type === 'error'
      ? css`
          color: ${({ theme }) => theme.color.toast.error.text};
        `
      : css`
          color: ${({ theme }) => theme.color.toast.success.text};
        `}
`;

export type ToastType = 'none' | 'info' | 'error';
const VARIANTS = {
  none: () => css``,
  info: (theme: any) => css`
    border: solid 1px ${theme.color.toast.success.border};
    background-color: ${theme.color.toast.success.bg};
    color: ${theme.color.toast.success.text};
  `,
  error: (theme: any) => css`
    border: solid 1px ${theme.color.toast.error.border};
    background-color: ${theme.color.toast.error.bg};
    color: ${theme.color.toast.error.text};
  `
};

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);
  const { isLightMode } = useAppSelector(themeInfoSelector);

  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);

  const closeToast = useCallback(() => dispatch(initToast()), [dispatch]);

  useEffect(() => {
    if (toast.type !== 'none') {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      if (!timer.current) {
        timer.current = setTimeout(() => {
          timer.current = null;
          closeToast();
        }, 3000);
      }
    }
  }, [toast, closeToast]);

  if (toast.type === 'none') return null;

  return (
    <ToastMsgWrapper variant={toast.type}>
      <IconWrapper>
        <Icon
          size="sm"
          iconSrc={
            toast.type === 'error'
              ? isLightMode
                ? WarningLightIcon
                : WarningDarkIcon
              : isLightMode
                ? PassLightIcon
                : PassDarkIcon
          }
        />
      </IconWrapper>
      <ToastText>{toast.msg}</ToastText>
      <CloseWrapper type={toast.type}>
        <IconButton iconSize="lg" iconComponent={IconClose} onClick={closeToast} />
      </CloseWrapper>
    </ToastMsgWrapper>
  );
}
