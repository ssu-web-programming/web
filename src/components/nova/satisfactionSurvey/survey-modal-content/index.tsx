import { useState } from 'react';
import { overlay } from 'overlay-kit';

import * as S from './style';

export default function SurveyModalContent() {
  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    handleClose();
  };

  return (
    <S.ModalContainer>
      <div>ddd</div>
    </S.ModalContainer>
  );
}
