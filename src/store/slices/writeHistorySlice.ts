import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface WriteType {
  id: string;
  result: string;
  input: string;
  preProcessing: {
    type: string;
    arg1: string;
    arg2: string;
  };
}

interface WriteHistoryType {
  history: WriteType[];
  currentWriteId: string | null;
}

export const WRITE_HISTORY_MAX = 10;

const writeHistorySlice = createSlice({
  name: 'writeHistory',
  initialState: { history: [], currentWriteId: null } as WriteHistoryType,
  reducers: {
    initWriteHistory: (state) => {
      state.history = [];
      state.currentWriteId = null;
    },
    addWriteHistory: (state, action: PayloadAction<WriteType>) => {
      const history =
        state.history.length >= WRITE_HISTORY_MAX
          ? state.history.slice(1, WRITE_HISTORY_MAX)
          : state.history;
      state.history = [...history, action.payload];
    },
    updateWriteHistory: (state, action: PayloadAction<WriteType>) => {
      state.history = state.history.map((history) => {
        if (history.id === action.payload.id) {
          return {
            ...history,
            result: history.result + action.payload.result
          };
        }
        return history;
      });
    },
    removeWriteHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((history) => history.id !== action.payload);
    },
    setCurrentWrite: (state, action: PayloadAction<string>) => {
      state.currentWriteId = action.payload;
    },
    resetCurrentWrite: (state) => {
      state.currentWriteId = null;
    }
  }
});

export const {
  initWriteHistory,
  addWriteHistory,
  updateWriteHistory,
  setCurrentWrite,
  resetCurrentWrite,
  removeWriteHistory
} = writeHistorySlice.actions;
export const selectWriteHistorySlice = (state: RootState) => state.writeHistory;
export default writeHistorySlice.reducer;
