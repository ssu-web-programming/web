import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatHistory from './slices/chatHistorySlice';
import toast from './slices/toastSlice';
import recFunction from './slices/recFuncSlice';
import writeHistory from './slices/writeHistorySlice';
import tab, { shareAnswerState } from './slices/tabSlice';
import txtimgHistory from './slices/txt2imgHistory';
import network from './slices/network';
import confirm from './slices/confirm';
import loadingSpinner from './slices/loadingSpinner';
import banner from './slices/banner';
import askDoc from './slices/askDoc';

import askDocModal from './slices/askDocModalsSlice';
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
    banner,
    askDoc
    askDocModal,
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
