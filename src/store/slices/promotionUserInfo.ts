import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export enum IEventType {
  UNKNOWN = -1,
  AI_STAMP_EVENT = 0,
  DONATION_10TH_ANNIVERSARY_EVENT = 1,
  AI_NOVA_LUCKY_EVENT = 2
}

export enum IAccurePromotionAction {
  UNKNOWN = -1,
  USE_AIWRITE = 0,
  USE_ASKDOC = 1,
  USE_TEXTTOIMAGE = 2,
  USE_AI_OVER_3DAYS = 3,
  USE_AICREDIT_OVER_50 = 4,
  PAID_NON_AILEVEL = 5,
  PAID_AILEVEL = 6,
  DONATION_10TH_ANNIVERSARY = 7,
  WIN_STARBUCK_COUPON = 8,
  WIN_BUZ = 9,
  WIN_IPAD = 10
}

type IAccurePromotionUserStatus = null | 'VALID' | 'ALREADY_USED' | 'NO_AGREEMENT_DATA';

export type IPromotionUserInfo = {
  type: IEventType;
  accureAction: IAccurePromotionAction;
  userId: string;
  timeUpdate: number;
  timeRegist: number;
  point: number;
  status: IAccurePromotionUserStatus;
};

const initialState: IPromotionUserInfo = {
  type: -1,
  accureAction: -1,
  userId: '',
  timeUpdate: 0,
  timeRegist: 0,
  point: 0,
  status: null
};

const promotionUserInfo = createSlice({
  name: 'promotionUserInfo',
  initialState: initialState,
  reducers: {
    initUserInfo: () => initialState,
    setUserInfo: (state, action: PayloadAction<IPromotionUserInfo>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { initUserInfo, setUserInfo } = promotionUserInfo.actions;
export const userInfoSelector = (state: RootState) => state.promotionUserInfo;
export default promotionUserInfo.reducer;
