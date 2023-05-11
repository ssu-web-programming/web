import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AiImageResponse } from '../../views/ImageCreate';

interface T2IType {
  id: string;
  list: AiImageResponse[];
}

interface T2IListType {
  history: T2IType[];
  currentListId: string | null;
  currentItemIdx: number | null;
}

const WRITE_HISTORY_MAX = 10;

const txtimgHistorySlice = createSlice({
  name: 'txtimgHistory',
  initialState: { history: [], currentListId: null, currentItemIdx: null } as T2IListType,
  reducers: {
    initT2IHistory: (state) => {
      state.history = [];
      state.currentListId = null;
    },
    addT2I: (state, action: PayloadAction<T2IType>) => {
      const history =
        state.history.length >= WRITE_HISTORY_MAX
          ? state.history.slice(1, WRITE_HISTORY_MAX - 1)
          : state.history;

      state.history = [...history, action.payload];
    },
    updateT2ICurListId: (state, action: PayloadAction<string | null>) => {
      state.currentListId = action.payload;
    },
    updateT2ICurItemIndex: (state, action: PayloadAction<number | null>) => {
      state.currentItemIdx = action.payload;
    }
  }
});

export const { initT2IHistory, addT2I, updateT2ICurListId, updateT2ICurItemIndex } =
  txtimgHistorySlice.actions;
export const selectT2IHIstory = (state: RootState) => state.txtimgHistory;
export default txtimgHistorySlice.reducer;
