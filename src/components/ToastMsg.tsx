import { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { initToast } from '../store/slices/toastSlice';
import { useDispatch } from 'react-redux';

const Fade = keyframes`
  0% {
      opacity: 0;
  }
  50%{
    opacity: 1;
  }
  100% {
      opacity: 0;
  }
`;

const ToastMsgWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 100px;

  word-wrap: break-word;
  max-width: 70%;
  border-radius: 2px;
  background-color: blue;
  color: white;
  padding: 10px 20px 10px 20px;
  opacity: 0;
  animation: ${Fade} 1.5s;
`;

const ToastText = styled.div`
  display: flex;
  width: 100%;
  word-break: break-all;
`;

const CloaseBtn = styled.div`
  display: flex;
  margin-left: 10px;
  cursor: pointer;
`;

const ToastMsg = ({ msg }: { msg: string }) => {
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
    }, 2000);
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
        <ToastMsgWrapper>
          <ToastText>{msg}</ToastText>
          <CloaseBtn onClick={() => setIsVisible(false)}>x</CloaseBtn>
        </ToastMsgWrapper>
      )}
    </>
  );
};

export default ToastMsg;
