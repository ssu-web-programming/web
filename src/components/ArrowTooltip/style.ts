import Button from '@mui/material/Button';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

export const CustomButton = styled(Button)<{ cssExt?: FlattenSimpleInterpolation }>`
  &.MuiTooltip-tooltip {
    ${({ cssExt }) => (cssExt ? cssExt : '')}
  }
`;
