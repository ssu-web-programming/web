import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import alliApps from './slices/alliApps';
import appState from './slices/appState';
import askDoc from './slices/askDoc';
import askDocAnalyzeFiesSlice from './slices/askDocAnalyzeFiesSlice';
import askDocModal from './slices/askDocModalsSlice';
import askDocSummary from './slices/askDocSummary';
import chatHistory from './slices/chatHistorySlice';
import confirm from './slices/confirm';
import creditInfo from './slices/creditInfo';
import initFlagSlice from './slices/initFlagSlice';
import loadingSpinner from './slices/loadingSpinner';
import network from './slices/network';
import novaHistory from './slices/novaHistorySlice';
import novaModal from './slices/novaModalsSlice';
import promotionUserInfo from './slices/promotionUserInfo';
import recFunction from './slices/recFuncSlice';
import recognizedVoice from './slices/recognizedVoice';
import tab, { shareAnswerState } from './slices/tabSlice';
import toast from './slices/toastSlice';
import txtimgHistory from './slices/txt2imgHistory';
import uploadFiles from './slices/uploadFiles';
import userInfo from './slices/userInfo';
import writeHistory from './slices/writeHistorySlice';

const store = configureStore({
  reducer: {
    chatHistory,
    toast,
    recFunction,
    writeHistory,
    tab,
    txtimgHistory,
    network,
    confirm,
    loadingSpinner,
    askDoc,
    askDocModal,
    askDocAnalyzeFiesSlice,
    askDocSummary,
    initFlagSlice,
    alliApps,
    recognizedVoice,
    appState,
    novaHistory,
    novaModal,
    userInfo,
    promotionUserInfo,
    creditInfo,
    uploadFiles
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(shareAnswerState),
  devTools: process.env.NODE_ENV !== 'production'
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
