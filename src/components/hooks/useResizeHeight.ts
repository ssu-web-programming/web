import { RefObject } from 'react';

const useResizeHeight = () => {
  return (targetRef: RefObject<HTMLTextAreaElement>) => {
    if (targetRef?.current) {
      targetRef.current.style.height = 'auto';
      targetRef.current.style.height = targetRef?.current.scrollHeight + 'px';
    }
  };
};

export default useResizeHeight;
