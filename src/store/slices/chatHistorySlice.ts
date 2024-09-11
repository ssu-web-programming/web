import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EngineVersion } from '../../components/chat/RecommendBox/FormRec';
import { RootState } from '../store';

export interface StreamPreprocessing {
  type?: string;
  arg1?: string;
  arg2?: string;
}

export type ChatResultType = string;
export interface Chat {
  id: string;
  result: ChatResultType;
  role: 'assistant' | 'user' | 'reset' | 'info';
  input: string;
  preProcessing?: StreamPreprocessing;
  version?: EngineVersion;
}

interface ChatHistoryState {
  history: Chat[];
  defaultInput: string | null;
}

export const INPUT_MAX_LENGTH = 1000;

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: { history: [], defaultInput: null } as ChatHistoryState,
  reducers: {
    initChatHistory: (state, action: PayloadAction<Chat>) => {
      state.history = [action.payload];
    },
    appendChat: (state, action: PayloadAction<Chat>) => {
      state.history = [...state.history, action.payload];
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      state.history = state.history.map((chat) => {
        if (chat.id === action.payload.id) {
          return {
            ...chat,
            id: chat.id,
            role: chat.role,
            result: chat.result + action.payload.result,
            input: action.payload.input
          };
        }
        return chat;
      });
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((chat) => chat.id !== action.payload);
    },
    updateDefaultInput: (state, action: PayloadAction<string>) => {
      state.defaultInput = action.payload.slice(0, INPUT_MAX_LENGTH);
    },
    resetDefaultInput: (state) => {
      state.defaultInput = null;
    }
  }
});

export const {
  initChatHistory,
  appendChat,
  updateChat,
  updateDefaultInput,
  resetDefaultInput,
  removeChat
} = chatHistorySlice.actions;
export const selectChatHistory = (state: RootState) => state.chatHistory;
export default chatHistorySlice.reducer;
