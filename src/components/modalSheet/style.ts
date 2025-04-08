import { Sheet } from 'react-modal-sheet';
import styled from 'styled-components';

export const CustomSheet = styled(Sheet)`
  .react-modal-sheet-backdrop {
    /* custom styles */
  }

  .react-modal-sheet-container {
    max-height: calc(100% - env(safe-area-inset-top) - 56px);
    background-color: ${({ theme }) => theme.color.background.yellow02} !important;
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
  }

  .react-modal-sheet-header {
    height: 22px !important;
    margin-bottom: 10px;
  }

  .react-modal-sheet-drag-indicator {
    width: 40px !important;
    height: 6px !important;
    background-color: ${({ theme }) => theme.color.background.gray13} !important;
  }

  .react-modal-sheet-content {
    overflow-y: auto;
  }
`;
