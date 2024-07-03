import { useEffect, useRef, useCallback } from 'react';
import styled, { FlattenSimpleInterpolation, css, keyframes } from 'styled-components';
import { initToast, selectToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Icon from '../Icon';
import IconButton from 'components/buttons/IconButton';
import icon_info from 'img/ico_toast_new_info.svg';
import icon_success from 'img/ico_toast_new_success.svg';
import icon_error from 'img/ico_toast_new_error.svg';
import { ReactComponent as IconClose } from 'img/ico_ai_close_black.svg';
import { alignItemStart, flex, flexGrow, flexShrink } from 'style/cssCommon';

const Fade = keyframes`
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
`;

const TIME = 500;

const ToastMsgWrapper = styled.div<{ variant: FlattenSimpleInterpolation }>`
  ${flex}
  ${alignItemStart}
  ${flexShrink}
  ${flexGrow}
  
  position: absolute;
  left: 50%;
  top: 92px;
  transform: translate(-50%, -50%);

  word-wrap: break-word;
  width: 313px;
  max-width: 80%;
  height: fit-content;
  border-radius: 10px;
  padding: 10px 14px;
  box-sizing: border-box;
  animation: ${Fade} ${TIME}ms;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 var(--black-10);

  ${(props) => props.variant}

  z-index: 50;
`;

const ToastText = styled.div`
  flex: 1;
  padding: 0 10px;
  line-height: 21px;
  font-size: 14px;
`;

export type ToastType = 'none' | 'info' | 'success' | 'error';

const toastSrc = {
  info: icon_info,
  success: icon_success,
  error: icon_error
};

const VARIANTS = {
  none: css``,
  info: css`
    border: solid 1px var(--primary-po-blue-40);
    background-color: #e8f2fe;
    color: var(--primary-po-blue-60);
  `,
  success: css`
    border: solid 1px var(--primary-po-green-40);
    background-color: #edf7e8;
    color: var(--primary-po-green-50);
  `,
  error: css`
    border: solid 1px var(--primary-po-red-40);
    background-color: #feeeee;
    color: var(--primary-po-red-50);
  `
};

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

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

  const variant = VARIANTS[toast.type];

  return (
    <ToastMsgWrapper variant={variant}>
      <Icon size={21} iconSrc={toastSrc[toast.type]} />
      <ToastText>{toast.msg}</ToastText>
      <IconButton iconSize="sm" iconComponent={IconClose} onClick={closeToast} />
    </ToastMsgWrapper>
  );
}
