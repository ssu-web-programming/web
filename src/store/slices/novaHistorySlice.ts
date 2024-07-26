import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type NovaChatType = {
  id: string;
  input: string;
  output: string;

  role: string;
  type: '' | 'image' | 'document';
  vsId?: string;
  threadId?: string;
  askType: '' | 'document' | 'image';

  res?: string;

  status: 'none' | 'request' | 'stream' | 'done' | 'cancel';
  files?: {
    name: string;
  }[];
};

const novaHistorySlice = createSlice({
  name: 'novaHistory',
  initialState: [] as NovaChatType[],
  reducers: {
    initNovaHistory: () => [],
    pushChat: (state, action: PayloadAction<Omit<NovaChatType, 'status' | 'askType'>>) => {
      state.push({ ...action.payload, status: 'request', askType: '' });
    },
    appendChatOutput: (
      state,
      action: PayloadAction<Pick<NovaChatType, 'id' | 'output' | 'vsId' | 'threadId' | 'askType'>>
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
    },
    removeChat: (state, action: PayloadAction<NovaChatType['id']>) => {
      return state.filter((chat) => chat.id !== action.payload);
    }
  }
});

export const {
  initNovaHistory,
  pushChat,
  appendChatOutput,
  addChatOutputRes,
  updateChatStatus,
  removeChat
} = novaHistorySlice.actions;
export const novaHistorySelector = (state: RootState) => state.novaHistory;
export default novaHistorySlice.reducer;
