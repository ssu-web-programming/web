import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IInitialState {
  keywords: string[];
  questions: string[];
  summary: string;
}

const initState: IInitialState = {
  keywords: [],
  questions: [],
  summary: ''
};

const askDocSummary = createSlice({
  name: 'summary',
  initialState: initState,
  reducers: {
    initSummary: () => initState,
    setSummary: (state, action: PayloadAction<IInitialState>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { initSummary, setSummary } = askDocSummary.actions;
export const summarySelector = (state: RootState) => state.askDocSummary;
export default askDocSummary.reducer;
