import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type NovaChatType = {
  id: string;
  input: string;
  output: string;

  role: string;
  type: string;
  vsId?: string;
  threadId?: string;

  res?: string;

  status: 'none' | 'request' | 'stream' | 'done' | 'cancel';
};

const novaHistorySlice = createSlice({
  name: 'novaHistory',
  initialState: [] as NovaChatType[],
  reducers: {
    initNovaHistory: () => [],
    pushChat: (state, action: PayloadAction<Omit<NovaChatType, 'status'>>) => {
      state.push({ ...action.payload, status: 'request' });
    },
    appendChatOutput: (
      state,
      action: PayloadAction<Pick<NovaChatType, 'id' | 'output' | 'vsId' | 'threadId'>>
    ) => {
      return state.map((chat) =>
        chat.id === action.payload.id
          ? {
              ...chat,
              ...action.payload,
              output: chat.output + action.payload.output,
              status: 'stream'
            }
          : chat
      );
    },
    addChatOutputRes: (state, action: PayloadAction<Pick<NovaChatType, 'id' | 'res'>>) => {
      return state.map((chat) =>
        chat.id === action.payload.id
          ? {
              ...chat,
              res: action.payload.res
            }
          : chat
      );
    },
    updateChatStatus: (state, action: PayloadAction<Pick<NovaChatType, 'id' | 'status'>>) => {
      return state.map((chat) =>
        chat.id === action.payload.id
          ? {
              ...chat,
              status: action.payload.status
            }
          : chat
      );
    }
  }
});

export const { initNovaHistory, pushChat, appendChatOutput, addChatOutputRes, updateChatStatus } =
  novaHistorySlice.actions;
export const novaHistorySelector = (state: RootState) => state.novaHistory;
export default novaHistorySlice.reducer;
