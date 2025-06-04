import * as React from 'react';
import { useEffect } from 'react';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

import * as S from './style';

const CustomTooltip = styled(
  ({
    className,
    tooltipStyles,
    arrowStyles,
    ...props
  }: TooltipProps & {
    tooltipStyles?: React.CSSProperties;
    arrowStyles?: React.CSSProperties;
  }) => <Tooltip {...props} arrow classes={{ popper: className }} />
)(({ theme, tooltipStyles, arrowStyles }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.color.background.tooltip,
    ...(arrowStyles || {})
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '6px 10px',
    marginBottom: '4px !important',
    backgroundColor: theme.color.background.tooltip,
    backdropFilter: 'blur(6px)',
    whiteSpace: 'break-spaces',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '150%',
    borderRadius: '8px',
    ...(tooltipStyles || {})
  }
}));

interface ArrowTooltipsProps {
  message: string;
  children?: React.ReactNode;
  cssExt?: FlattenSimpleInterpolation;
  placement?: TooltipProps['placement'];
  autoClose?: boolean;
  isReady?: boolean;
  tooltipStyles?: React.CSSProperties;
  arrowStyles?: React.CSSProperties;
}

export default function ArrowTooltips({
  message,
  children,
  cssExt,
  placement,
  autoClose = false,
  isReady = true,
  tooltipStyles,
  arrowStyles
}: ArrowTooltipsProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);
  const autoCloseTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleTooltipToggle = (event: React.MouseEvent) => {
    if (!isReady) return;

    if (autoClose) {
      event.preventDefault();
    } else {
      event.stopPropagation();
      setOpen((prev) => !prev);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (autoClose) return;

    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      setOpen(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (!isReady) {
      setOpen(false);
      return;
    }

    if (open) {
      if (autoClose) {
        autoCloseTimer.current = setTimeout(() => {
          setOpen(false);
        }, 2000);
      } else {
        setTimeout(() => {
          document.addEventListener('mousedown', handleClickOutside);
        }, 0);
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [open, autoClose, isReady]);

  return (
    <div ref={tooltipRef} style={{ height: '100%' }}>
      <CustomTooltip
        title={message}
        arrow
        placement={placement || 'top'}
        open={open}
        onClick={handleTooltipToggle}
        tooltipStyles={tooltipStyles}
        arrowStyles={arrowStyles}>
        <S.CustomButton className="tooltipBtn" cssExt={cssExt}>
          {children}
        </S.CustomButton>
      </CustomTooltip>
    </div>
  );
}
