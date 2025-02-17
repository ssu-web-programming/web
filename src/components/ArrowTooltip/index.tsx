import * as React from 'react';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

import * as S from './style';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.color.background.tooltip
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.color.background.tooltip,
    whiteSpace: 'break-spaces'
  }
}));

interface ArrowTooltipsProps {
  message: string;
  children: React.ReactNode;
  cssExt?: FlattenSimpleInterpolation;
  placement?: TooltipProps['placement'];
}

export default function ArrowTooltips({
  message,
  children,
  cssExt,
  placement
}: ArrowTooltipsProps) {
  return (
    <CustomTooltip title={message} arrow placement={placement || 'top'}>
      <S.CustomButton className="tooltipBtn" cssExt={cssExt}>
        {children}
      </S.CustomButton>
    </CustomTooltip>
  );
}
