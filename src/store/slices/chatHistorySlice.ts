import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Chat {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  input: string;
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
            id: chat.id,
            role: chat.role,
            content: chat.content + action.payload.content,
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
