import { Routes, Route, useNavigate } from 'react-router-dom';
import Tools from './pages/Tools';
import Toast from './components/toast/Toast';
import { useAppDispatch, useAppSelector } from './store/store';
import { useCallback, useEffect, useRef } from 'react';
import { setBridgeMessage } from './store/slices/bridge';
import TextToImage from './pages/TextToImage';
import GlobalStyle from './style/globalStyle';
import InvalidAccess from './pages/InvalidAccess';
import { useMoveChatTab } from './components/hooks/useMovePage';
import { getI18n, useTranslation } from 'react-i18next';
import { activeToast } from './store/slices/toastSlice';
import Offline from './pages/Offline';
import gI18n, { LANG_KO_KR, convertLangFromLangCode } from './locale';
import { selectTabSlice } from './store/slices/tabSlice';
import { updateT2ICurItemIndex, updateT2ICurListId } from './store/slices/txt2imgHistory';
import Spinner from './components/Spinner';
import Confirm from './components/Confirm';
import useApiWrapper from './api/useApiWrapper';
import { BANNER_ACTIVE_API } from './api/constant';
import { setBanner } from './store/slices/banner';
import Bridge from './util/bridge';

function App() {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();
  const { creating } = useAppSelector(selectTabSlice);

  const navigate = useNavigate();
  const movePage = useMoveChatTab();
  const apiWrapper = useApiWrapper();

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
                  if (body && body !== '') {
                    movePage(body);
                  }
                } else {
                  path = `/txt2img`;
                  if (body && body !== '') {
                    dispatch(updateT2ICurListId(null));
                    dispatch(updateT2ICurItemIndex(null));
                  }
                }
                navigate(path, {
                  state: { body }
                });
              } else {
                dispatch(
                  activeToast({
                    type: 'error',
                    msg: t(`ToastMsg.TabLoadedAndWait`, { tab: t(creating) })
                  })
                );
              }
              break;
            }
            case 'showToast': {
              const msg = i18n.t(body);
              dispatch(activeToast({ type: 'error', msg }));
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
      } catch (err) {}
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
    Bridge.callBridgeApi('initComplete');
  }, []);

  const setPSEventActive = async () => {
    const res = await apiWrapper(BANNER_ACTIVE_API, {});
    const resJson = await res.res.json();

    dispatch(setBanner(resJson.data.enable && getI18n().resolvedLanguage === LANG_KO_KR));
  };

  useEffect(() => {
    setPSEventActive();
  }, []);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <>
        <Routes>
          <Route path="/aiWrite" element={<Tools></Tools>}></Route>
          <Route path="/txt2img" element={<TextToImage></TextToImage>}></Route>
          <Route path="*" element={<InvalidAccess></InvalidAccess>}></Route>
        </Routes>
        <Offline></Offline>
        <Toast />
        <Spinner />
        <Confirm />
      </>
    </>
  );
}

export default App;
