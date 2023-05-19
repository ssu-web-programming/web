import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatHistory from './slices/chatHistorySlice';
import toast from './slices/toastSlice';
import bridge from './slices/bridge';
import recFunction from './slices/recFuncSlice';
import writeHistory from './slices/writeHistorySlice';
import tab from './slices/tabSlice';
import txtimgHistory from './slices/txt2imgHistory';
import network from './slices/network';

const store = configureStore({
  reducer: {
    chatHistory,
    toast,
    recFunction,
    writeHistory,
    tab,
    bridge,
    txtimgHistory,
    network
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
