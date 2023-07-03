import { useEffect, useRef, useCallback } from 'react';
import styled, { FlattenSimpleInterpolation, css, keyframes } from 'styled-components';
import { initToast, selectToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Icon from '../Icon';
import icon_close_green from '../../img/ico_ai_close_green.svg';
import icon_close_red from '../../img/ico_ai_close_red.svg';
import icon_warnning from '../../img/ico_toast_warning.svg';
import icon_pass from '../../img/ico_toast_completion.svg';
import { alignItemStart, flex, flexGrow, flexShrink } from '../../style/cssCommon';

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
  width: 360px;
  max-width: 80%;

  box-sizing: border-box;
  height: fit-content;

  border-radius: 10px;
  padding: 4px;
  animation: ${Fade} ${TIME}ms;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 var(--black-10);

  ${(props) => props.variant}
`;

const IconWrapper = styled.div`
  padding: 8px;
`;

const ToastText = styled.div`
  flex: 1;
  height: fit-content;
  line-height: normal;
  padding: 6px 0px;
`;

export type ToastType = 'none' | 'info' | 'error';
const VARIANTS = {
  none: css``,
  info: css`
    border: solid 1px #85ca5f;
    background-color: #edf7e8;
    color: var(--primary-po-green-60);
  `,
  error: css`
    border: solid 1px #fa8c8c;
    background-color: #feeeee;
    color: var(--sale);
  `
};

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  const timer = useRef<any>(null);

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
      <IconWrapper>
        <Icon size="sm" iconSrc={toast.type === 'error' ? icon_warnning : icon_pass} />
      </IconWrapper>
      <ToastText>{toast.msg}</ToastText>
      <Icon
        size="lg"
        iconSrc={toast.type === 'error' ? icon_close_red : icon_close_green}
        onClick={closeToast}
      />
    </ToastMsgWrapper>
  );
}
