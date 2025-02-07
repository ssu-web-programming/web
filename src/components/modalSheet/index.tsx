import React from 'react';
import { Sheet } from 'react-modal-sheet';

import * as S from './style';

type SheetDetent = 'full-height' | 'content-height';

interface modalSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  detent?: SheetDetent;
  snapPoints?: number[];
  initialSnap?: number;
}

export default function ModalSheet({
  isOpen,
  setIsOpen,
  children,
  ...otherProps
}: modalSheetProps) {
  return (
    <S.CustomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} {...otherProps}>
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
