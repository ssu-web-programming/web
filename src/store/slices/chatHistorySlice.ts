import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ChatPreProcessing {
  type?: string;
  arg?: string;
}
export interface Chat {
  id: string;
  result: string;
  role: 'assistant' | 'user';
  input: string;
  preProcessing?: ChatPreProcessing;
}

interface ChatHistoryState {
  history: Chat[];
  defaultInput: string | null;
}

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
    updateDefaultInput: (state, action: PayloadAction<string | null>) => {
      state.defaultInput = action.payload;
    }
  }
});

export const { initChatHistory, appendChat, updateChat, updateDefaultInput } =
  chatHistorySlice.actions;
export const selectChatHistory = (state: RootState) => state.chatHistory;
export default chatHistorySlice.reducer;
