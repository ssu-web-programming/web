import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export type NovaChatType = {
  type: string;
  content: string;
  files?: string[];
};

const initialState: NovaChatType[] = [];

const novaShareChatHistory = createSlice({
  name: 'novaShareChatHistory',
  initialState,
  reducers: {
    setNovaShareChat: (state, action: PayloadAction<NovaChatType[]>) => {
      return action.payload;
    }
  }
});

export const { setNovaShareChat } = novaShareChatHistory.actions;
export const novaShareChatSelector = (state: RootState) => state.novaShareChatHistory;
export default novaShareChatHistory.reducer;
