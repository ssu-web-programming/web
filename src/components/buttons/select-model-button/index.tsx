import { ButtonHTMLAttributes } from 'react';
import icon_credit_gray from 'img/ico_credit_gray.svg';
import { FlattenSimpleInterpolation } from 'styled-components';

import { Chip } from '../IconTextButton';

import * as S from './style';

type StyledProps = {
  buttonStyle?: FlattenSimpleInterpolation;
};

type Item = {
  deductCredit?: number | string;
  id: string;
  title: string;
  desc: string;
  creditValue?: string;
};

type Props = {
  item: Item;
  selected?: boolean;
  hideSelectedStyles?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  StyledProps;

export default function SelectModelButton({
  item,
  selected = false,
  onClick,
  buttonStyle,
  hideSelectedStyles = false
}: Props) {
  return (
    <S.StyledButton
      selected={selected}
      onClick={onClick}
      buttonStyle={buttonStyle}
      hideSelectedStyles={hideSelectedStyles}>
      <S.InnerWrapper>
        <S.ItemWrapper selected={selected}>
          <p>{item.title}</p>
          <p>{item.desc}</p>
        </S.ItemWrapper>
        <S.IconWrapper>
          <Chip iconSrc={icon_credit_gray} size={20}>
            <span>{item.deductCredit}</span>
          </Chip>
        </S.IconWrapper>
      </S.InnerWrapper>
    </S.StyledButton>
  );
}
