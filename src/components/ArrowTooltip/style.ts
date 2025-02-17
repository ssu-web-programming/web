import Button from '@mui/material/Button';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

export const CustomButton = styled(Button)<{ cssExt?: FlattenSimpleInterpolation }>`
  &.MuiButtonBase-root {
    min-width: auto;
    padding: 0;

    ${({ cssExt }) => (cssExt ? cssExt : '')}
  }
`;
