import React from 'react';
import { AudioRecorderProvider } from 'pages/Nova/VoiceDictation/provider/audio-recorder-provider';
import VoiceDictationProvider from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import store from './store/store';
import App from './App';

import './index.css';

// eslint-disable-next-line
import './locale';

declare global {
  interface Window {
    Native?: any;
    webkit?: any;
    chrome?: any;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();

function Root() {
  return (
    <Provider store={store}>
      <VoiceDictationProvider>
        <AudioRecorderProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </AudioRecorderProvider>
      </VoiceDictationProvider>
    </Provider>
  );
}

root.render(<Root />);
