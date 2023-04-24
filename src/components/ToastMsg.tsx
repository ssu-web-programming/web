import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const Fade = keyframes`
  0% {
      opacity: 0;
  }
  70%{
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
  animation: ${Fade} 2s;
`;

const ToastText = styled.div`
  display: flex;
  width: 100%;
  word-break: break-all;
`;

const CloaseBtn = styled.div`
  display: flex;
  margin-left: 10px;
`;

const ToastMsg = ({ msg }: { msg: string }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

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
