import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export enum ClientType {
  unknown = 'unknown',
  android = 'android',
  ios = 'ios',
  mac = 'mac',
  windows = 'windows',
  web = 'web'
}

export enum DeviceType {
  unknown = 'unknown',
  phone = 'phone',
  pad = 'pad'
}

type InitialState = {
  platform: ClientType;
  device: DeviceType;
  version: string;
};

const initialState: InitialState = {
  platform: ClientType.unknown,
  device: DeviceType.unknown,
  version: ''
};

const platformInfo = createSlice({
  name: 'platformInfo',
  initialState,
  reducers: {
    setPlatformInfo: (state, action: PayloadAction<InitialState>) => {
      const { platform, version, device } = action.payload;
      console.log('redux platform: ', platform);
      console.log('redux version: ', version);
      console.log('redux device: ', device);
      state.platform = platform;
      state.device = device;
      state.version = version;
      return state;
    },
    getPlatformInfo: (state) => {
      console.log('현재 state 반환!', state);
      return state;
    }
  }
});

export const { setPlatformInfo, getPlatformInfo } = platformInfo.actions;
export const platformInfoSelector = (state: RootState) => state.platformInfo;
export default platformInfo.reducer;
