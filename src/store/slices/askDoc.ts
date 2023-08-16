import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AskDocChat {
  id: string;
  result: string;
  role: 'user' | 'assistant' | 'info';
  input: string;
  info?: {
    request: 'askDoc' | 'gpt';
    page?: number[];
  };
}

export type AskDocStatus = 'ready' | 'completeAnalyze' | 'failedAnalyze' | 'failedConvert';
export type AskDocSourceId = string;
interface AskDocState {
  status: AskDocStatus;
  questionList: string[];
  sourceId?: AskDocSourceId;
  askDocHistory: AskDocChat[];
}

export const INPUT_MAX_LENGTH = 1000;

const askDoc = createSlice({
  name: 'askDoc',
  initialState: {
    status: 'ready',
    questionList: [],
    sourceId: undefined,
    askDocHistory: []
  } as AskDocState,
  reducers: {
    setStatus: (state, action: PayloadAction<AskDocStatus>) => {
      state.status = action.payload;
    },
    setSrouceId: (state, action: PayloadAction<AskDocSourceId>) => {
      state.status = 'completeAnalyze';
      state.sourceId = action.payload;
    },
    initChatHistory: (state, action: PayloadAction<AskDocChat>) => {
      state.askDocHistory = [action.payload];
    },
    appendChat: (state, action: PayloadAction<AskDocChat>) => {
      state.askDocHistory = [...state.askDocHistory, action.payload];
    },
    updateChat: (state, action: PayloadAction<AskDocChat>) => {
      state.askDocHistory = state.askDocHistory.map((chat) => {
        if (chat.id === action.payload.id) {
          return {
            ...chat,
            ...action.payload,
            id: chat.id,
            role: chat.role,
            result: chat.result + action.payload.result
          };
        }
        return chat;
      });
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.askDocHistory = state.askDocHistory.filter((chat) => chat.id !== action.payload);
    },
    setQuestionList: (state, action: PayloadAction<string[]>) => {
      state.questionList = action.payload;
    },
    setSourceId: (state, action: PayloadAction<string>) => {
      state.sourceId = action.payload;
    }
  }
});

export const {
  setStatus,
  setSrouceId,
  initChatHistory,
  appendChat,
  updateChat,
  removeChat,
  setQuestionList,
  setSourceId
} = askDoc.actions;
export const selectAskDoc = (state: RootState) => state.askDoc;
export default askDoc.reducer;
