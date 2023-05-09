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

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);
  const navigate = useNavigate();
  const movePage = useMoveChatTab();

  const procMsg = async (msg: string) => {
    try {
      const { cmd, body } = JSON.parse(msg);
      dispatch(setBridgeMessage({ cmd, body: JSON.stringify(body) }));
      switch (cmd) {
        case 'sessionInfo': {
          const res = await (
            await fetch('/api/v2/user/getCurrentLoginStatus', {
              headers: {
                'content-type': 'application/json',
                'X-PO-AI-MayFlower-Auth-AID': body['AID'],
                'X-PO-AI-MayFlower-Auth-BID': body['BID'],
                'X-PO-AI-MayFlower-Auth-SID': body['SID']
              },
              method: 'GET'
            })
          ).json();
          const email = res?.data?.userInfo?.email;
          const resultMsg = res?.data?.userInfo?.resultMsg;
          dispatch(setBridgeMessage({ cmd: `${cmd}_response`, body: email ? email : resultMsg }));
          break;
        }
        case 'openAiTools':
        case 'openTextToImg': {
          const path = cmd === `openAiTools` ? `/aiWrite` : `/txt2img`;
          const time = new Date().getTime();
          movePage('im bonnie'); // Change input and get parameter
          navigate(path, {
            state: { body, time }
          });
          break;
        }
        default: {
          break;
        }
      }
    } catch (err) {}
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
        {toast.active && <ToastMsg msg={toast.msg} />}
      </Wrapper>
    </>
  );
}

export default App;
