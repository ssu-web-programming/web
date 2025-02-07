import styled, { FlattenSimpleInterpolation } from 'styled-components';

export const Container = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  width: 24px;
  height: 24px;

  ${(props) => props.cssExt || ''};
`;
