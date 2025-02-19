import styled, { FlattenSimpleInterpolation } from 'styled-components';

export const Circle = styled.div<{
  checked: boolean;
  isCircle: boolean;
  cssExt?: FlattenSimpleInterpolation;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 20px;
  min-width: 20px;
  height: 20px;
  border: ${({ checked, isCircle, theme }) =>
    checked ? 'none' : isCircle ? '1px solid #c9cdd2' : `2px solid ${theme.color.text.gray01}`};
  border-radius: ${({ isCircle }) => (isCircle ? '20px' : '4px')};

  ${(props) => props.cssExt || ''};
`;
