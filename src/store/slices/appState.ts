import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type DocType = string;
type InitialState = {
  docType: DocType;
};

const initialState: InitialState = {
  docType: 'unknown'
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setDocType: (state, action: PayloadAction<DocType>) => {
      state.docType = action.payload;
      return state;
    }
  }
});

export const { setDocType } = appStateSlice.actions;
export const appStateSelector = (state: RootState) => state.appState;
export default appStateSlice.reducer;
