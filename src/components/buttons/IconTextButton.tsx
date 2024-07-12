import { PropsWithChildren } from 'react';
import Button, { ButtonProps } from './Button';
import Icon, { IconSize } from '../Icon';
import styled from 'styled-components';
import { alignItemCenter, flex, justiCenter } from '../../style/cssCommon';

const Contents = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  gap: 6px;

  width: 100%;
  position: relative;
  line-height: 20px;
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
