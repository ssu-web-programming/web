import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import store from './store/store';
import { selectTheme } from './theme/theme';
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
// async function deferRender() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }
//
//   const { worker } = await import('./mocks/worker');
//
//   // `worker.start()` returns a Promise that resolves
//   // once the Service Worker is up and ready to intercept requests.
//   return worker.start();
// }
// deferRender().then(() => {
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={selectTheme()}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </ThemeProvider>
  // </React.StrictMode>
);
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
