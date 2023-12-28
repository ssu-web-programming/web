import { useEffect, useState } from 'react';

const usePercentage = (
  isLoading: boolean,
  isSuccess: boolean,
  startPercent: number = 0,
  targetPercent: number = 100,
  speed: number = 250
) => {
  const [percentage, setPercentage] = useState(startPercent);
  useEffect(() => {
    if (isLoading) {
      if (percentage < targetPercent) {
        setTimeout(() => setPercentage((prev) => prev + 1), speed);
      }
    }
  }, [isLoading, percentage, setPercentage, targetPercent, speed]);

  useEffect(() => {
    if (isSuccess) {
      if (percentage < targetPercent) {
        setTimeout(() => setPercentage((prev) => prev + 1), 10);
      }
    }
  }, [isSuccess, percentage, setPercentage, targetPercent]);
  return {
    percentage
  };
};

export default usePercentage;
