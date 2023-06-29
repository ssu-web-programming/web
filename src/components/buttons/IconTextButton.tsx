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
`;

type IconPos = 'left' | 'right';

export interface IconTextButtonProps extends ButtonProps {
  iconSrc: string;
  iconPos?: IconPos;
  iconSize?: IconSize | number;
}

export default function IconTextButton(props: PropsWithChildren<IconTextButtonProps>) {
  const { children, iconPos, iconSrc, iconSize = 'sm', ...rest } = props;

  return (
    <Button {...rest}>
      {iconPos === 'right' ? (
        <Contents>
          {children}
          <Icon size={iconSize} iconSrc={iconSrc}></Icon>
        </Contents>
      ) : (
        <Contents>
          <Icon size={iconSize} iconSrc={iconSrc}></Icon>
          {children}
        </Contents>
      )}
    </Button>
  );
}
