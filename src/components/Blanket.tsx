import { PropsWithChildren } from 'react';
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

const Blanket = (
  props: PropsWithChildren<{
    onClick?: () => void;
  }>
) => {
  const { children, onClick = () => {} } = props;
  return <BlanketBG onClick={onClick}>{children}</BlanketBG>;
};

export default Blanket;
