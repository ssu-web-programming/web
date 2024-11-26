import { ButtonHTMLAttributes } from 'react';
import icon_credit_gray from 'img/ico_credit_gray.svg';
import { VersionType } from 'store/slices/txt2imgHistory';

import { Chip } from '../IconTextButton';

import * as S from './style';

type Item = {
  deductCredit?: number;
  id: VersionType;
  title: string;
  desc: string;
  creditValue: string;
};

type Props = {
  item: Item;
  selected: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SelectModelButton({ item, selected, onClick }: Props) {
  return (
    <S.StyledButton selected={selected} onClick={onClick}>
      <S.InnerWrapper>
        <S.ItemWrapper selected={selected}>
          <p>{item.title}</p>
          <p>{item.desc}</p>
        </S.ItemWrapper>
        <S.IconWrapper>
          <Chip iconSrc={icon_credit_gray} size={20}>
            <p>{item.deductCredit}</p>
          </Chip>
        </S.IconWrapper>
      </S.InnerWrapper>
    </S.StyledButton>
  );
}
