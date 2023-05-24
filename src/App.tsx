import { Routes, Route, useNavigate } from 'react-router-dom';
import Tools from './pages/Tools';
import Wrapper from './components/Wrapper';
import ToastMsg from './components/ToastMsg';
import { useAppDispatch, useAppSelector } from './store/store';
import { selectToast } from './store/slices/toastSlice';
import { useCallback, useEffect, useRef } from 'react';
import { setBridgeMessage } from './store/slices/bridge';
import TextToImage from './pages/TextToImage';
import GlobalStyle from './style/globalStyle';
import InvalidAccess from './pages/InvalidAccess';
import { useMoveChatTab } from './components/hooks/useMovePage';
import { useTranslation } from 'react-i18next';
import { activeToast } from './store/slices/toastSlice';
import OfflineView from './components/OfflineView';
import gI18n, { convertLangFromLangCode } from './locale';
import { selectTabSlice } from './store/slices/tabSlice';
import { updateT2ICurItemIndex, updateT2ICurListId } from './store/slices/txt2imgHistory';

function App() {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();
  const toast = useAppSelector(selectToast);
  const { creating } = useAppSelector(selectTabSlice);
  const navigate = useNavigate();
  const movePage = useMoveChatTab();

  const procMsg = useRef<(msg: any) => void>();
  procMsg.current = useCallback(
    async (msg: any) => {
      try {
        const { cmd, body } = msg;
        if (cmd && cmd !== '') {
          dispatch(setBridgeMessage({ cmd, body: JSON.stringify(body) }));
          switch (cmd) {
            case 'openAiTools':
            case 'openTextToImg': {
              if (creating === 'none') {
                let path = ``;
                if (cmd === `openAiTools`) {
                  path = `/aiWrite`;
                } else {
                  path = `/txt2img`;
                  dispatch(updateT2ICurListId(null));
                  dispatch(updateT2ICurItemIndex(null));
                }
                const time = new Date().getTime();
                movePage(body);
                navigate(path, {
                  state: { body, time }
                });
              } else {
                dispatch(
                  activeToast({
                    active: true,
                    msg: t(`ToastMsg.TabLoadedAndWait`, { tab: t(creating) }),
                    isError: true
                  })
                );
              }
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
            case 'changeLang': {
              const lang = convertLangFromLangCode(body);
              gI18n.changeLanguage(lang);
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
    },
    [creating]
  );

  useEffect(() => {
    document.addEventListener('CustomBridgeEvent', (e: any) => {
      if (procMsg.current) {
        procMsg.current(e.detail);
      }
    });
    window.addEventListener(
      'message',
      (e) => {
        if (procMsg.current) {
          procMsg.current(e.data);
        }
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
        <OfflineView></OfflineView>
      </Wrapper>
    </>
  );
}

export default App;
