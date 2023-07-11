import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface recSubType {
  id: string;
  icon?: string;
}

export interface recType extends recSubType {
  subList: string[] | null;
}

interface recFuncType {
  isOpen: boolean;
  isActive: boolean;
  selectedRecFunction: recType | null;
  selectedSubRecFunction: recSubType | null;
}

const recFuncSlice = createSlice({
  name: 'recFunction',
  initialState: {
    isOpen: true,
    isActive: false,
    selectedRecFunction: null,
    selectedSubRecFunction: null
  } as recFuncType,
  reducers: {
    initRecFunc: (state) => {
      state.selectedRecFunction = null;
      state.selectedSubRecFunction = null;
    },
    openRecFunc: (state) => {
      state.isOpen = true;
    },
    closeRecFunc: (state) => {
      state.isOpen = false;
    },
    selectRecFunc: (state, action: PayloadAction<recType | null>) => {
      state.selectedRecFunction = action.payload;
    },
    selectSubRecFunc: (state, action: PayloadAction<recSubType | null>) => {
      state.selectedSubRecFunction = action.payload;
    },
    activeRecFunc: (state) => {
      state.isActive = true;
    },
    inactiveRecFunc: (state) => {
      state.isActive = false;
    }
  }
});

export const {
  initRecFunc,
  selectRecFunc,
  selectSubRecFunc,
  openRecFunc,
  closeRecFunc,
  activeRecFunc,
  inactiveRecFunc
} = recFuncSlice.actions;
export const selectRecFuncSlice = (state: RootState) => state.recFunction;
export default recFuncSlice.reducer;
