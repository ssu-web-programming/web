import { useEffect, useState, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { initToast } from '../store/slices/toastSlice';
import { useDispatch } from 'react-redux';
import Icon from './Icon';
import icon_close_green from '../img/ico_ai_close_green.svg';
import icon_close_red from '../img/ico_ai_close_red.svg';
import icon_warnning from '../img/ico_toast_warning.svg';
import icon_pass from '../img/ico_toast_completion.svg';

const Fade = keyframes`
  0% {
      opacity: 0;
  }
  20%{
    opacity: 1;
  }
  80%{
    opacity: 1;
  }
  100% {
      opacity: 0;
  }
`;

const TIME = 5000;

const ToastMsgWrapper = styled.div<{ isError: boolean }>`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 100px;

  word-wrap: break-word;
  width: 80%;
  flex-grow: 1;
  border-radius: 10px;
  padding: 4px 4px 11px 12px;
  opacity: 0;
  animation: ${Fade} ${TIME}ms;
  font-size: 13px;
  box-shadow: 0 2px 8px 0 var(--black-10);

  ${({ isError }) =>
    isError
      ? css`
          border: solid 1px #fa8c8c;
          background-color: #feeeee;
          color: var(--sale);
        `
      : css`
          border: solid 1px #85ca5f;
          background-color: #edf7e8;
          color: var(--primary-po-green-60);
        `}
`;

const ToastText = styled.div`
  display: flex;
  width: 100%;
  word-break: break-all;
`;

const ToastMsg = ({ msg, isError }: { msg: string; isError: boolean }) => {
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const delayTime = useRef<number>(2000);

  const closeToast = () => {
    dispatch(initToast());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      closeToast();
    }, TIME);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    delayTime.current += 2000;
  }, [msg]);

  return (
    <>
      {isVisible && (
        <ToastMsgWrapper isError={isError}>
          <Icon
            cssExt={css`
              width: 16px;
              height: 16px;
              margin-top: 4px;
              margin-right: 12px;
            `}
            iconSrc={isError ? icon_warnning : icon_pass}
          />
          <ToastText>{msg}</ToastText>
          <Icon
            cssExt={css`
              width: 24px;
              height: 24px;
            `}
            iconSrc={isError ? icon_close_red : icon_close_green}
            onClick={() => setIsVisible(false)}
          />
        </ToastMsgWrapper>
      )}
    </>
  );
};

export default ToastMsg;
