import { Routes, Route, useNavigate } from 'react-router-dom';
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
import { useMoveChatTab } from './components/hooks/useMovePage';
import { useTranslation } from 'react-i18next';
import { activeToast } from './store/slices/toastSlice';

function App() {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const toast = useAppSelector(selectToast);
  const navigate = useNavigate();
  const movePage = useMoveChatTab();

  const procMsg = async (msg: any) => {
    try {
      const { cmd, body } = msg;
      if (cmd && cmd !== '') {
        dispatch(setBridgeMessage({ cmd, body: JSON.stringify(body) }));
        switch (cmd) {
          case 'openAiTools':
          case 'openTextToImg': {
            const path = cmd === `openAiTools` ? `/aiWrite` : `/txt2img`;
            const time = new Date().getTime();
            movePage(body);
            navigate(path, {
              state: { body, time }
            });
            break;
          }
          case 'showToast': {
            const msg = i18n.t(body);
            dispatch(
              activeToast({
                active: true,
                msg,
                isError: true
              })
            );
            break;
          }
          default: {
            break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.addEventListener('CustomBridgeEvent', (e: any) => {
      procMsg(e.detail);
    });
    window.addEventListener(
      'message',
      (e) => {
        procMsg(e.data);
      },
      false
    );
    window._Bridge.initComplete();
  }, []);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <Wrapper>
        <Routes>
          <Route path="/aiWrite" element={<Tools></Tools>}></Route>
          <Route path="/txt2img" element={<TextToImage></TextToImage>}></Route>
          <Route path="*" element={<InvalidAccess></InvalidAccess>}></Route>
        </Routes>
        {toast.active && <ToastMsg msg={toast.msg} isError={toast.isError} />}
      </Wrapper>
    </>
  );
}

export default App;
