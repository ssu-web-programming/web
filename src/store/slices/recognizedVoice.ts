import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface RecognizedVoiceType {
  recognizedVoice: string;
}

const initState: RecognizedVoiceType = {
  recognizedVoice: ''
};

const recognizedVoiceSlice = createSlice({
  name: 'recognizedVoice',
  initialState: initState,
  reducers: {
    setRecognizedVoice: (state, action: PayloadAction<RecognizedVoiceType>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { setRecognizedVoice } = recognizedVoiceSlice.actions;
export const recognizedVoiceSelector = (state: RootState) => state.recognizedVoice;
export default recognizedVoiceSlice.reducer;
