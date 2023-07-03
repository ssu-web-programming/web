import styled from 'styled-components';

const BlanketBG = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -100%);
  opacity: 0.2;
  background-color: #000;
  width: 100%;
  height: 100%;
`;

const Dim = ({ children, onClick }: { children?: React.ReactNode; onClick?: Function }) => {
  return (
    <BlanketBG
      onClick={() => {
        onClick && onClick();
      }}>
      {children}
    </BlanketBG>
  );
};

export default Dim;
