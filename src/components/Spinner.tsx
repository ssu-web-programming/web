import styled from 'styled-components';

import spinner from '../img/light/spinner.webp';
import { selectLoadingSpinner } from '../store/slices/loadingSpinner';
import { useAppSelector } from '../store/store';

import Blanket from './Blanket';

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;

  width: 250px;
  height: 200px;
  border-radius: 4px;

  font-size: 13px;
  font-weight: normal;
  color: var(--gray-gray-80-02);
`;

const SpinnerImg = styled.img`
  display: flex;

  background-color: white;
  border-radius: 50%;
  margin-bottom: 16px;
  width: 48px;
  height: 48px;
`;

const Spinner = () => {
  const { msg, active } = useAppSelector(selectLoadingSpinner);

  return (
    <>
      {active && (
        <>
          <Blanket />
          <SpinnerWrapper>
            <SpinnerImg src={spinner} alt="loading" />
            {msg}
          </SpinnerWrapper>
        </>
      )}
    </>
  );
};

export default Spinner;
