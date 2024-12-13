import React from 'react';
import styled from 'styled-components';

import Spinner from '../../img/light/spinner.webp';

const Dim = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.dimBg};
  z-index: 2;

  img {
    width: 48px;
    height: 48px;
  }
`;

export default function Progress() {
  return (
    <Dim>
      <img src={Spinner} alt="spinner" />
    </Dim>
  );
}
