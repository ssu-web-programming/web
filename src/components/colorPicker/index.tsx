import { Dispatch, SetStateAction, useState } from 'react';
import { FlattenSimpleInterpolation } from 'styled-components';

import ColorPickerIcon from '../../img/common/ico_color_picker.svg';

import ColorPickerModal from './colorPickerModal';
import * as S from './style';

interface ColorPickerProps {
  title: string;
  color: string;
  setColor: (color: string) => void;
  cssExt?: FlattenSimpleInterpolation;
}

export default function ColorPicker({ title, color, setColor, cssExt }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <S.Container cssExt={cssExt} onClick={() => setIsOpen(true)}>
        <img src={ColorPickerIcon} alt="color_picker" />
      </S.Container>
      {isOpen && (
        <ColorPickerModal title={title} color={color} setColor={setColor} setIsOpen={setIsOpen} />
      )}
    </>
  );
}
