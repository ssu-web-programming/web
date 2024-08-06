import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type DocType = string;
type InitialState = {
  docType: DocType;
  novaExpireTime: number;
};

const initialState: InitialState = {
  docType: 'unknown',
  novaExpireTime: 1800000
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setDocType: (state, action: PayloadAction<DocType>) => {
      state.docType = action.payload;
      return state;
    },
    setNovaExpireTime: (state, action: PayloadAction<number>) => {
      state.novaExpireTime = action.payload;
      return state;
    }
  }
});

export const { setDocType, setNovaExpireTime } = appStateSlice.actions;
export const appStateSelector = (state: RootState) => state.appState;
export default appStateSlice.reducer;
