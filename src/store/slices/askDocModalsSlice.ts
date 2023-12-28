import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type ModalState = {
  type:
    | 'overpage'
    | 'remine'
    | 'samefile'
    | 'upgrade'
    | 'analyzefail'
    | 'uploadfail'
    | 'lackOfCredit'
    | 'default';
  props: {
    buttonOnclick: () => void;
    leftButtonOnClick: () => void;
    rightButtonOnClick: () => void;
  };
};

const initialState: ModalState[] = [];

export const modalSelector = (state: RootState) => state.askDocModal;

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, props } = action.payload;

      // 같은 모달 두개 열리는 경우 방어
      if (state.length > 0 && state[state.length - 1].type === type) return;
      return state.concat({ type, props });
    },
    closeModal: (state) => {
      state.pop();
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
