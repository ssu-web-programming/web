import { PropsWithChildren } from 'react';
import Button, { ButtonProps } from './Button';
import Icon from '../Icon';
import { css } from 'styled-components';
import icon_credit from '../../img/ico_credit.svg';

const OverlapCss = css`
  position: absolute;
  right: 6px;
  flex: none;
`;

export default function CreditButton(props: PropsWithChildren<ButtonProps>) {
  const { cssExt, ...rest } = props;

  return (
    <Button
      {...rest}
      cssExt={css`
        ${cssExt}
        position: relative;
      `}>
      {props.children}
      <Icon size="sm" cssExt={OverlapCss} iconSrc={icon_credit} />
    </Button>
  );
}
