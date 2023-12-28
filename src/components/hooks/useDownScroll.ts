import { RefObject } from 'react';

const useDownScroll = () => {
  return (chatEndRef: RefObject<HTMLElement>) => {
    if (chatEndRef?.current) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
};

export default useDownScroll;
