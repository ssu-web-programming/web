import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { platformInfoSelector } from 'store/slices/platformInfo';
import { useAppSelector } from 'store/store';
import styled from 'styled-components';
import { ClientType } from 'util/bridge';

import Icon, { IconSize } from '../Icon';

import Button, { ButtonProps } from './Button';

const ChipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  span {
    order: 2;
    margin: 0 0 0 2px;

    font-size: 11px;
    font-weight: 400;
    line-height: 13.13px;

    color: var(--gray-gray-70);
  }

  p {
    margin: 0 0 0 2px;

    font-size: 14px;
    font-weight: 400;
    line-height: 13.13px;

    color: var(--gray-gray-90-01);
  }
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 100%;
  position: relative;
  line-height: 20px;
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

interface TooltipProps {
  isVisible: boolean;
}

const Tooltip = styled.div<TooltipProps>`
  width: fit-content;
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);

  background-color: ${({ theme }) => theme.color.background.gray08};
  color: ${({ theme }) => theme.color.background.gray05};
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;

  /* 말풍선 꼬리 */
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.color.background.gray08} transparent transparent
      transparent;
  }

  @media (hover: hover) {
    ${TooltipWrapper}:hover & {
      visibility: visible;
    }
  }
`;

type IconPos = 'left' | 'right' | 'end' | 'top';

export interface IconTextButtonProps extends ButtonProps {
  iconSrc: string | React.ReactNode;
  iconPos?: IconPos;
  iconSize?: IconSize | number;
  innerText?: boolean;
  tooltip?: string;
  tooltipDuration?: number;
}

export default function IconTextButton(props: PropsWithChildren<IconTextButtonProps>) {
  const {
    children,
    iconPos = 'right',
    iconSrc,
    iconSize = 'sm',
    tooltip,
    tooltipDuration = 2000,
    ...rest
  } = props;

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { platform } = useAppSelector(platformInfoSelector);
  const isMobile = platform === ClientType.ios || platform === ClientType.android;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!tooltip) return;

    e.stopPropagation();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 툴팁 표시
    setIsTooltipVisible(true);

    timerRef.current = window.setTimeout(() => {
      setIsTooltipVisible(false);
      timerRef.current = null;
    }, tooltipDuration);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const buttonContent = (
    <Contents>
      {iconPos === 'left' && (
        <>
          <Icon size={iconSize} iconSrc={iconSrc} />
          {children}
        </>
      )}
      {iconPos === 'right' && (
        <>
          {children}
          <Icon size={iconSize} iconSrc={iconSrc} />
        </>
      )}
      {iconPos === 'end' && (
        <>
          {children}
          <div style={{ position: 'absolute', right: '11px' }}>
            <Icon size={iconSize} iconSrc={iconSrc} />
          </div>
        </>
      )}
      {iconPos === 'top' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ margin: '0 auto' }}>
            <Icon size={iconSize} iconSrc={iconSrc} />
          </div>
          {children}
        </div>
      )}
    </Contents>
  );

  if (tooltip) {
    return (
      <TooltipWrapper onTouchStart={isMobile ? handleTouchStart : undefined}>
        <Button {...rest}>{buttonContent}</Button>
        <Tooltip isVisible={isTooltipVisible}>{tooltip}</Tooltip>
      </TooltipWrapper>
    );
  }

  return <Button {...rest}>{buttonContent}</Button>;
}

export const Chip = ({
  iconSrc,
  children,
  size = 12
}: PropsWithChildren<{ iconSrc: string; size?: number }>) => {
  return (
    <ChipWrapper>
      <Icon iconSrc={iconSrc} size={size} />
      {children}
    </ChipWrapper>
  );
};
