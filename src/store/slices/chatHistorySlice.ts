import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Chat {
  id: string;
  content: string;
  role: 'assistant' | 'user';
}

interface ChatHistoryState {
  history: Chat[];
}

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: { history: [] } as ChatHistoryState,
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
            content: chat.content + action.payload.content
          };
        }
        return chat;
      });
    }
  }
});

export const { initChatHistory, appendChat, updateChat } = chatHistorySlice.actions;
export const selectChatHistory = (state: RootState) => state.chatHistory.history;
export default chatHistorySlice.reducer;
