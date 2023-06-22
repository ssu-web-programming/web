import styled from 'styled-components';

const DimBG = styled.div`
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
    <DimBG
      onClick={() => {
        onClick && onClick();
      }}>
      {children}
    </DimBG>
  );
};

export default Dim;
