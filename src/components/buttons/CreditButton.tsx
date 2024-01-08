import { PropsWithChildren } from 'react';
import Button, { ButtonProps } from './Button';
import Icon from '../Icon';
import styled, { css } from 'styled-components';
import icon_credit from '../../img/ico_credit.svg';
import { flex } from '../../style/cssCommon';

const IconWrapper = styled.div`
  ${flex}
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
      <IconWrapper>
        <Icon size="sm" iconSrc={icon_credit} />
      </IconWrapper>
    </Button>
  );
}
