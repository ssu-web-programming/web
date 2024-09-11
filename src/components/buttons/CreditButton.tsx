import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import icon_credit from '../../img/ico_credit.svg';
import { flex } from '../../style/cssCommon';
import Icon from '../Icon';

import Button, { ButtonProps } from './Button';

const IconWrapper = styled.div`
  ${flex}
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
        gap: 8px;
      `}>
      {props.children}
      <IconWrapper>
        <Icon size="sm" iconSrc={icon_credit} />
      </IconWrapper>
    </Button>
  );
}
