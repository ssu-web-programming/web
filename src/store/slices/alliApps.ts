import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AppInfo } from '../../pages/Alli/Alli';

interface AlliCreateResult {
  inputs: any;
  output: string;
}

interface AlliAppsState {
  apps: AppInfo[] | null;
  selectedApp: AppInfo | null;
  createResult: AlliCreateResult;
}

const initialState: AlliAppsState = {
  apps: null,
  selectedApp: null,
  createResult: {
    inputs: {},
    output: ''
  }
};

const alliAppsSlice = createSlice({
  name: 'alliApps',
  initialState,
  reducers: {
    setAlliApps: (state, action: PayloadAction<AppInfo[]>) => {
      state.apps = action.payload;
    },
    setSelectedApp: (state, action: PayloadAction<AppInfo | null>) => {
      state.selectedApp = action.payload;
    },
    setCreateResult: (state, action: PayloadAction<AlliCreateResult>) => {
      state.createResult = action.payload;
    },
    resetCreateResult: (state) => {
      state.createResult = initialState.createResult;
    }
  }
});

export const { setAlliApps, setSelectedApp, setCreateResult, resetCreateResult } =
  alliAppsSlice.actions;
export const selectAlliApps = (state: RootState) => state.alliApps;
export default alliAppsSlice.reducer;
