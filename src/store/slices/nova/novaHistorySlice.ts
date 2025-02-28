import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SERVICE_TYPE } from '../../../constants/serviceType';
import { RootState } from '../../store';

export interface NovaFileInfo {
  name: string;
  fileId: string;
  file: File;
  fileRevision: number;
  base64?: string | null;
}

export interface NovaWebReference {
  site?: string;
  title: string;
  desc?: string;
  type?: string;
  url: string;
  favicon?: string;
}

export type NovaChatType = {
  id: string;
  input: string;
  output: string;

  role: string;
  type: '' | 'image' | 'document';
  vsId?: string;
  threadId?: string;
  askType: '' | 'document' | 'image';
  chatType: SERVICE_TYPE;
  isAnswer?: boolean;

  res?: string;
  expiredTime?: number;

  status: 'none' | 'request' | 'stream' | 'done' | 'cancel';
  files?: NovaFileInfo[];

  references?: NovaWebReference[];
  recommendedQuestions?: string[];
};

export type NovaHistoryState = {
  chatHistory: NovaChatType[];
  chatMode: SERVICE_TYPE;
  selectedItems: string[];
  isShareMode: boolean;
  isExporting: boolean;
};

const initialState: NovaHistoryState = {
  chatHistory: [],
  chatMode: SERVICE_TYPE.NOVA_CHAT_GPT4O,
  selectedItems: [],
  isShareMode: false,
  isExporting: false
};

const novaHistorySlice = createSlice({
  name: 'novaHistory',
  initialState,
  reducers: {
    initNovaHistory: (state) => {
      state.chatHistory = [];
      state.selectedItems = [];
    },
    pushChat: (
      state,
      action: PayloadAction<Omit<NovaChatType, 'status' | 'askType'> & { isAnswer?: boolean }>
    ) => {
      state.chatHistory.push({
        ...action.payload,
        status: 'request',
        askType: '',
        isAnswer: action.payload.isAnswer ?? false
      });
    },
    appendChatReferences: (
      state,
      action: PayloadAction<Pick<NovaChatType, 'id' | 'references'>>
    ) => {
      const chat = state.chatHistory.find((chat) => chat.id === action.payload.id);
      if (chat) {
        chat.references = action.payload.references;
      }
    },
    appendChatRecommendedQuestions: (
      state,
      action: PayloadAction<Pick<NovaChatType, 'id' | 'recommendedQuestions'>>
    ) => {
      const chat = state.chatHistory.find((chat) => chat.id === action.payload.id);
      if (chat) {
        chat.recommendedQuestions = action.payload.recommendedQuestions;
      }
    },
    appendChatOutput: (
      state,
      action: PayloadAction<
        Pick<NovaChatType, 'id' | 'output' | 'vsId' | 'threadId' | 'askType' | 'expiredTime'>
      >
    ) => {
      const chat = state.chatHistory.find((chat) => chat.id === action.payload.id);
      if (chat) {
        chat.output += action.payload.output;
        chat.vsId = action.payload.vsId;
        chat.threadId = action.payload.threadId;
        chat.askType = action.payload.askType;
        chat.expiredTime = action.payload.expiredTime;
        chat.status = 'stream';
      }
    },
    changeChatOutput: (state, action: PayloadAction<Pick<NovaChatType, 'id' | 'output'>>) => {
      const chat = state.chatHistory.find((chat) => chat.id === action.payload.id);
      if (chat) {
        chat.output = action.payload.output;
      }
    },
    addChatOutputRes: (state, action: PayloadAction<Pick<NovaChatType, 'id' | 'res'>>) => {
      const chat = state.chatHistory.find((chat) => chat.id === action.payload.id);
      if (chat) {
        chat.res = action.payload.res;
      }
    },
    updateChatStatus: (state, action: PayloadAction<Pick<NovaChatType, 'id' | 'status'>>) => {
      const chat = state.chatHistory.find((chat) => chat.id === action.payload.id);
      if (chat) {
        chat.status = action.payload.status;
      }
    },
    removeChat: (state, action: PayloadAction<NovaChatType['id']>) => {
      state.chatHistory = state.chatHistory.filter((chat) => chat.id !== action.payload);
    },
    setChatMode: (state, action: PayloadAction<SERVICE_TYPE>) => {
      state.chatMode = action.payload;
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      if (state.selectedItems.includes(itemId)) {
        state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
      } else {
        state.selectedItems.push(itemId);
      }
    },
    selectAllItems: (state) => {
      state.selectedItems = state.chatHistory.flatMap((chat) => {
        const threadId = chat.id;
        if (!threadId) return [];

        return [`q:${threadId}`, `a:${threadId}`];
      });
    },
    deselectAllItems: (state) => {
      state.selectedItems = [];
    },
    setIsShareMode: (state, action: PayloadAction<boolean>) => {
      state.isShareMode = action.payload;
    },
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    }
  }
});

export const {
  initNovaHistory,
  pushChat,
  addChatOutputRes,
  appendChatOutput,
  changeChatOutput,
  appendChatReferences,
  appendChatRecommendedQuestions,
  updateChatStatus,
  removeChat,
  setChatMode,
  toggleItemSelection,
  selectAllItems,
  deselectAllItems,
  setIsShareMode,
  setIsExporting
} = novaHistorySlice.actions;

export const novaHistorySelector = (state: RootState) => state.novaHistory.chatHistory;
export const novaChatModeSelector = (state: RootState) => state.novaHistory.chatMode;
export const selectedItemsSelector = (state: RootState) => state.novaHistory.selectedItems;
export const isShareModeSelector = (state: RootState) => state.novaHistory.isShareMode;
export const isExportingSelector = (state: RootState) => state.novaHistory.isExporting;

export default novaHistorySlice.reducer;
