import React from 'react';
import styled from 'styled-components';

import Spinner from '../../img/spinner.webp';

const Dim = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
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
