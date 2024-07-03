import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const BlanketBG = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.2;
  background-color: #000;
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
