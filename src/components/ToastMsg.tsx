import { useEffect, useState, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { initToast } from '../store/slices/toastSlice';
import { useDispatch } from 'react-redux';
import Icon from './Icon';
import icon_close_green from '../img/ico_ai_close_green.svg';
import icon_close_red from '../img/ico_ai_close_red.svg';
import icon_warnning from '../img/ico_toast_warning.svg';
import icon_pass from '../img/ico_toast_completion.svg';
import { alignItemCenter, flex, flexGrow, flexShrink } from '../style/cssCommon';

const Fade = keyframes`
  0% {
      opacity: 0;
  }
  10%{
    opacity: 1;
  }
  90%{
    opacity: 1;
  }
  100% {
      opacity: 0;
  }
`;

const TIME = 5000;

const ToastMsgWrapper = styled.div<{ isError: boolean }>`
  ${alignItemCenter}
  ${flex}
  ${flexShrink}
  ${flexGrow}
  
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 92px;

  word-wrap: break-word;
  /* white-space: pre-wrap; */
  width: 360px;
  max-width: 80%;

  box-sizing: border-box;
  height: fit-content;

  border-radius: 10px;
  padding: 10px 4px 10px 12px;
  opacity: 0;
  animation: ${Fade} ${TIME}ms;
  font-size: 13px;
  font-weight: 500;
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
  ${flex}

  width: 280px;
  max-width: 80%;
  margin-left: 28px;
  height: fit-content;
  line-height: normal;
`;

const ToastMsg = ({ msg, isError }: { msg: string | React.ReactNode; isError: boolean }) => {
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
            size="sm"
            cssExt={css`
              position: absolute;
              top: 12px;
              left: 12px;
              align-self: flex-start;
            `}
            iconSrc={isError ? icon_warnning : icon_pass}
          />
          <ToastText>{msg}</ToastText>
          <Icon
            size="lg"
            cssExt={css`
              position: absolute;
              top: 4px;
              right: 4px;
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
