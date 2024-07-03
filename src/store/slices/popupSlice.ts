import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type PopupProps = {
  title: string;
  confirmText?: string;
  onConfirm?: () => void;
  closeText?: string;
  onClose?: () => void;
  contents?: JSX.Element | string;
};

const initState: PopupProps = {
  title: '',
  confirmText: '',
  onConfirm: () => {},
  closeText: '',
  onClose: () => {},
  contents: ''
};

const popupSlice = createSlice({
  name: 'popup',
  initialState: initState,
  reducers: {
    initPopup: () => initState,
    activePopup: (state, action: PayloadAction<PopupProps>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { initPopup, activePopup } = popupSlice.actions;
export const selectPopup = (state: RootState) => state.popupSlice;
export default popupSlice.reducer;
