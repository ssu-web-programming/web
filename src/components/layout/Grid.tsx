import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { grid } from '../../style/cssCommon';

const Wrapper = styled.div<{ col: number }>`
  ${grid}
  ${({ col }) => css`
    -webkit-grid-columns: repeat(${col}, minmax(0, 1fr));
    grid-template-columns: repeat(${col}, minmax(0, 1fr));
  `}

  width: 100%;
  gap: 8px;
`;

interface GridProps {
  col: number;
}

export default function Grid(props: PropsWithChildren<GridProps>) {
  const { col, children } = props;
  return <Wrapper col={col}>{children}</Wrapper>;
}
