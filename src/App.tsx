import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Wrapper from './components/Wrapper';
import ToastMsg from './components/ToastMsg';
import { useAppDispatch, useAppSelector } from './store/store';
import { selectToast } from './store/slices/toastSlice';
import { useEffect } from 'react';
import { setBridgeMessage } from './store/slices/bridge';
import TextToImage from './pages/TextToImage';
import GlobalStyle from './style/globalStyle';
import InvalidAccess from './pages/InvalidAccess';

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    document.addEventListener('CustomBridgeEvent', (e: any) => {
      dispatch(setBridgeMessage(e.detail));
    });
    window._Bridge.initComplete();
  }, []);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <Wrapper>
        <Routes>
          <Route path="/tools" element={<Tools></Tools>}></Route>
          <Route path="/txt2img" element={<TextToImage></TextToImage>}></Route>
          <Route path="*" element={<InvalidAccess></InvalidAccess>}></Route>
        </Routes>
        {toast.active && <ToastMsg msg={toast.msg} />}
      </Wrapper>
    </>
  );
}

export default App;
