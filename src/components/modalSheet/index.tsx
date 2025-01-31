import React from 'react';
import { Sheet } from 'react-modal-sheet';

import * as S from './style';

interface modalSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export default function ModalSheet({ isOpen, setIsOpen, children }: modalSheetProps) {
  return (
    <S.CustomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} detent="content-height">
      <Sheet.Backdrop
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
        onTap={() => setIsOpen(false)}
      />
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
    </S.CustomSheet>
  );
}
