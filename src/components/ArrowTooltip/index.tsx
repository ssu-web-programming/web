import * as React from 'react';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

import { isMobile } from '../../util/bridge';

import * as S from './style';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.color.background.tooltip
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '8px',
    marginBottom: '4px !important',
    backgroundColor: theme.color.background.tooltip,
    whiteSpace: 'break-spaces',
    fontSize: '12px'
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
  const [open, setOpen] = React.useState(false);
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  const handleTooltipToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={tooltipRef}>
      <CustomTooltip
        title={message}
        arrow
        placement={placement || 'top'}
        open={open}
        onClick={handleTooltipToggle}>
        <S.CustomButton className="tooltipBtn" cssExt={cssExt}>
          {children}
        </S.CustomButton>
      </CustomTooltip>
    </div>
  );
}
