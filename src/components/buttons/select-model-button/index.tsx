import React, { ButtonHTMLAttributes, useEffect } from 'react';
import icon_credit_gray from 'img/light/ico_credit_gray.svg';
import { useTranslation } from 'react-i18next';
import { FlattenSimpleInterpolation } from 'styled-components';

import Spinner from '../../../img/light/spinner.webp';
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

export type SelectModelButtonProps = {
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
}: SelectModelButtonProps) {
  const { t } = useTranslation();

  useEffect(() => {}, [item]);

  return (
    <S.StyledButton
      selected={selected}
      onClick={onClick}
      buttonStyle={buttonStyle}
      hideSelectedStyles={hideSelectedStyles}>
      <S.InnerWrapper>
        <S.ItemWrapper selected={selected}>
          <p>{item.title}</p>
          <p>{t(item.desc)}</p>
        </S.ItemWrapper>
        <S.IconWrapper>
          {(() => {
            if (item.deductCredit === 0) {
              return (
                <S.FreeBadge>
                  <span>{t('Nova.Home.free')}</span>
                </S.FreeBadge>
              );
            }

            if (!item.deductCredit) {
              return <img src={Spinner} alt="spinner" width={24} height={24} />;
            }

            return (
              <Chip iconSrc={icon_credit_gray} size={20}>
                <span>{item.deductCredit}</span>
              </Chip>
            );
          })()}
        </S.IconWrapper>
      </S.InnerWrapper>
    </S.StyledButton>
  );
}
