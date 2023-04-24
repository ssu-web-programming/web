import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <Wrap>{children}</Wrap>;
}
