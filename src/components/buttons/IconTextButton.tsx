import { PropsWithChildren } from 'react';
import styled from 'styled-components';

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

const Tooltip = styled.div`
  width: fit-content;
  visibility: hidden;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);

  background-color: ${({ theme }) => theme.color.subBgGray08};
  color: ${({ theme }) => theme.color.subBgGray05};
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
    border-color: ${({ theme }) => theme.color.subBgGray08} transparent transparent transparent;
  }

  ${TooltipWrapper}:hover & {
    visibility: visible;
  }
`;

type IconPos = 'left' | 'right' | 'end' | 'top';

export interface IconTextButtonProps extends ButtonProps {
  iconSrc: string | React.ReactNode;
  iconPos?: IconPos;
  iconSize?: IconSize | number;
  innerText?: boolean;
  tooltip?: string;
}

export default function IconTextButton(props: PropsWithChildren<IconTextButtonProps>) {
  const { children, iconPos = 'right', iconSrc, iconSize = 'sm', tooltip, ...rest } = props;

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
      <TooltipWrapper>
        <Button {...rest}>{buttonContent}</Button>
        <Tooltip>{tooltip}</Tooltip>
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
