import { Dispatch, SetStateAction, useState } from 'react';
import { css } from 'styled-components';

import Blanket from '../../Blanket';
import Button from '../../buttons/Button';

import * as S from './style';
import { Preset } from './style';

interface ColorPickerModalProps {
  title: string;
  color: string;
  setColor: (color: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const colorPreset = ['#000000', '#0008ff', '#00ff3b', '#e9ebed', '#ffffff'];

export default function ColorPickerModal({
  title,
  color,
  setColor,
  setIsOpen
}: ColorPickerModalProps) {
  const [tempColor, setTempColor] = useState('');

  return (
    <>
      <Blanket />
      <S.Container>
        <S.ContentWrap>
          <S.Title>{title}</S.Title>
          <S.ColorPickerWrap>
            <S.ColorPicker color={tempColor} onChange={setTempColor} />
            <S.ColorPickerInfo>
              <S.CurrentColor color={tempColor} />
              <S.PresetWrap>
                {colorPreset.map((color) => (
                  <S.Preset color={color} key={color} onClick={() => setTempColor(color)} />
                ))}
              </S.PresetWrap>
            </S.ColorPickerInfo>
          </S.ColorPickerWrap>
        </S.ContentWrap>
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
            onClick={() => {
              setColor(tempColor);
              setIsOpen(false);
            }}>
            <span>{'완료'}</span>
          </Button>
        </S.ButtonWrap>
      </S.Container>
    </>
  );
}
