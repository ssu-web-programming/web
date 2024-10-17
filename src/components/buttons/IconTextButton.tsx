import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import Icon, { IconSize } from '../Icon';

import Button, { ButtonProps } from './Button';

const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  width: 100%;
  position: relative;
  line-height: 20px;
`;

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
`;

type IconPos = 'left' | 'right' | 'end';

export interface IconTextButtonProps extends ButtonProps {
  iconSrc: string | React.ReactNode;
  iconPos?: IconPos;
  iconSize?: IconSize | number;
}

export default function IconTextButton(props: PropsWithChildren<IconTextButtonProps>) {
  const { children, iconPos = 'right', iconSrc, iconSize = 'sm', ...rest } = props;

  return (
    <Button {...rest}>
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
            <div
              style={{
                position: 'absolute',
                right: '11px'
              }}>
              <Icon size={iconSize} iconSrc={iconSrc} />
            </div>
          </>
        )}
      </Contents>
    </Button>
  );
}

export const Chip = ({ iconSrc, children }: PropsWithChildren<{ iconSrc: string }>) => {
  return (
    <ChipWrapper>
      <Icon iconSrc={iconSrc} size={12} />
      {children}
    </ChipWrapper>
  );
};
