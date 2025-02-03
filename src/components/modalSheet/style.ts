import { Sheet } from 'react-modal-sheet';
import styled from 'styled-components';

export const CustomSheet = styled(Sheet)`
  .react-modal-sheet-backdrop {
    /* custom styles */
  }

  .react-modal-sheet-container {
    background-color: ${({ theme }) => theme.color.background.yellow02} !important;
  }

  .react-modal-sheet-header {
    height: 22px;
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
