import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatHistory from './slices/chatHistorySlice';
import toast from './slices/toastSlice';
import bridge from './slices/bridge';

const store = configureStore({
  reducer: { chatHistory, toast, bridge },
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
