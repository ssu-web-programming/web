import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface BannerStateType {
  active: boolean;
  userLevel?: string;
}

const bannerSlice = createSlice({
  name: 'banner',
  initialState: { active: false } as BannerStateType,
  reducers: {
    initBanner: (state) => {
      state.active = false;
      state.userLevel = undefined;
    },
    activeBanner: (state) => {
      state.active = true;
    },
    setBanner: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload;
    },
    setUserLevel: (state, action: PayloadAction<string>) => {
      state.userLevel = action.payload;
    }
  }
});

export const { initBanner, activeBanner, setBanner, setUserLevel } = bannerSlice.actions;
export const selectBanner = (state: RootState) => state.banner;
export default bannerSlice.reducer;
