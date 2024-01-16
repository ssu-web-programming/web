import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
// eslint-disable-next-line
import './locale';
import { ThemeProvider } from 'styled-components';
import { selectTheme } from './theme/theme';
import { HelmetProvider } from 'react-helmet-async';

declare global {
  interface Window {
    Native?: any;
    webkit?: any;
    chrome?: any;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

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
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
  // </React.StrictMode>
);
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
