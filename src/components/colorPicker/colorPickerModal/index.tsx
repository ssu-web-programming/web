import { Dispatch, SetStateAction } from 'react';
import { css } from 'styled-components';

import CreditColorIcon from '../../../img/light/ico_credit_color.svg';
import Blanket from '../../Blanket';
import Button from '../../buttons/Button';

import * as S from './style';

interface ColorPickerModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ColorPickerModal({ setIsOpen }: ColorPickerModalProps) {
  return (
    <>
      <Blanket />
      <S.Container>
        <S.ButtonWrap>
          <Button
            variant="gray"
            width={'full'}
            height={48}
            cssExt={css`
              font-size: 16px;
              font-weight: 500;
              border-radius: 8px;
              flex: 1;
            `}
            onClick={() => {
              setIsOpen(false);
            }}>
            <span>{'취소'}</span>
          </Button>
          <Button
            variant="purple"
            width={'full'}
            height={48}
            cssExt={css`
              font-size: 16px;
              font-weight: 500;
              border-radius: 8px;
              flex: 2;
            `}
            onClick={() => {}}>
            <span>{'완료'}</span>
          </Button>
        </S.ButtonWrap>
      </S.Container>
    </>
  );
}
