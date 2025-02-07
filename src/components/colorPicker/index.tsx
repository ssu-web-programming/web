import { useState } from 'react';
import { FlattenSimpleInterpolation } from 'styled-components';

import ColorPickerIcon from '../../img/common/ico_color_picker.svg';

import ColorPickerModal from './colorPickerModal';
import * as S from './style';

interface ColorPickerProps {
  cssExt?: FlattenSimpleInterpolation;
}

export default function ColorPicker({ cssExt }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <S.Container cssExt={cssExt} onClick={() => setIsOpen(true)}>
        <img src={ColorPickerIcon} alt="color_picker" />
      </S.Container>
      {isOpen && <ColorPickerModal setIsOpen={setIsOpen} />}
    </>
  );
}
