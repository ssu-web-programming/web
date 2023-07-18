import spinner from '../img/spinner.webp';
import styled from 'styled-components';
import Blanket from './Blanket';
import { useAppSelector } from '../store/store';
import { selectLoadingSpinner } from '../store/slices/loadingSpinner';
import { alignItemCenter, flex, flexColumn, justiCenter } from '../style/cssCommon';

const SpinnerWrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;

  width: 250px;
  height: 200px;
  border-radius: 4px;
  border: solid 1px var(--gray-gray-50);
  background-color: #fff;

  font-size: 13px;
  font-weight: normal;
  color: var(--gray-gray-80-02);
`;

const SpinnerImg = styled.img`
  ${flex}

  background-color: white;
  border-radius: 50%;
  margin-bottom: 16px;
  width: 66px;
  height: 66px;
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
