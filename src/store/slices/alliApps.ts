import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AppInfo } from '../../pages/Alli/Alli';

interface AlliAppsState {
  apps: AppInfo[] | null;
  selectedApp: AppInfo | null;
}

const initialState: AlliAppsState = {
  apps: null,
  selectedApp: null
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
    }
  }
});

export const { setAlliApps, setSelectedApp } = alliAppsSlice.actions;
export const selectAlliApps = (state: RootState) => state.alliApps;
export default alliAppsSlice.reducer;
