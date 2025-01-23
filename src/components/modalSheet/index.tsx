import { Sheet } from 'react-modal-sheet';

interface modalSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ModalSheet({ isOpen, setIsOpen }: modalSheetProps) {
  return (
    <Sheet isOpen={isOpen} onClose={() => setIsOpen(isOpen)}>
      <Sheet.Container>
        <Sheet.Content>
          <Sheet.Scroller>some content</Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
