import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Toast from './components/toast/Toast';
import { useAppDispatch } from './store/store';
import { useEffect } from 'react';
import TextToImage from './pages/TextToImage';
import GlobalStyle from './style/globalStyle';
import InvalidAccess from './pages/InvalidAccess';
import Offline from './pages/Offline';
import Spinner from './components/Spinner';
import Confirm from './components/Confirm';
import useApiWrapper from './api/useApiWrapper';
import { BANNER_ACTIVE_API, JSON_CONTENT_TYPE } from './api/constant';
import { setBanner, setUserLevel } from './store/slices/banner';
import { useInitBridgeListener } from './util/bridge';
import AskDoc from './pages/AskDoc';
import VoiceDoc from './pages/VoiceDoc';

function App() {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const initBridgeListener = useInitBridgeListener();

  useEffect(() => {
    initBridgeListener();
  }, []);

  const updateEventBannerStatus = async () => {
    try {
      const { res, userInfo } = await apiWrapper(BANNER_ACTIVE_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          type: 'banner'
        }),
        method: 'POST'
      });

      dispatch(setUserLevel(userInfo.ul));

      const resJson = await res.json();
      dispatch(setBanner(resJson.data.enable));
    } catch {}
  };

  useEffect(() => {
    updateEventBannerStatus();
  }, []);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <>
        <Routes>
          <Route path="/aiWrite" element={<Tools></Tools>}></Route>
          <Route path="/txt2img" element={<TextToImage></TextToImage>}></Route>
          <Route path="/askdoc" element={<AskDoc></AskDoc>}></Route>
          <Route path="/voicedoc" element={<VoiceDoc></VoiceDoc>}></Route>
          <Route path="*" element={<InvalidAccess></InvalidAccess>}></Route>
        </Routes>
        <Offline />
        <Toast />
        <Spinner />
        <Confirm />
      </>
    </>
  );
}

export default App;
