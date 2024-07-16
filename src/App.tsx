import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Toast from './components/toast/Toast';
import { useCallback, useEffect } from 'react';
import TextToImage from './pages/TextToImage';
import GlobalStyle from './style/globalStyle';
import InvalidAccess from './pages/InvalidAccess';
import Offline from './pages/Offline';
import Spinner from './components/Spinner';
import Confirm from './components/Confirm';
import { useInitBridgeListener } from './util/bridge';
import AskDocHome from './pages/AskDocStep/AskDocHome';
import CheckDocHistory from './pages/AskDocStep/CheckDocHistory';
import ConfirmDoc from './pages/AskDocStep/ConfirmDoc';
import ProgressAnalysisDoc from './pages/AskDocStep/ProgressAnalysisDoc';
import StartAnalysisDoc from './pages/AskDocStep/StartAnalysisDoc';
import AskDoc from './pages/AskDoc';
import Chat from './pages/AskDocStep/Chat';
import AskDocLoading from './pages/AskDocStep/AskDocLoading';
import Alli from './pages/Alli/Alli';
import Nova from 'pages/Nova/Nova';
import { apiWrapper } from 'api/apiWrapper';
import { NOVA_GET_USER_INFO_AGREEMENT } from 'api/constant';
import { useAppDispatch } from 'store/store';
import { setNovaAgreement } from 'store/slices/userInfo';

function App() {
  const dispatch = useAppDispatch();
  const initBridgeListener = useInitBridgeListener();

  useEffect(() => {
    initBridgeListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initUserInfo = useCallback(async () => {
    try {
      const { res } = await apiWrapper().request(NOVA_GET_USER_INFO_AGREEMENT, { method: 'POST' });
      const {
        success,
        data: { agreement }
      } = await res.json();
      if (success) dispatch(setNovaAgreement(agreement));
    } catch (err) {}
  }, [dispatch]);

  useEffect(() => {
    initUserInfo();
  }, [initUserInfo]);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <>
        <Routes>
          <Route path="/aiWrite" element={<Tools></Tools>}></Route>
          <Route path="/txt2img" element={<TextToImage></TextToImage>}></Route>
          <Route path="/askdoc" element={<AskDoc />} />
          <Route path="/alli" element={<Alli />} />
          <Route path="/NOVA" element={<Nova />} />
          <Route path="/AskDocStep" element={<AskDocHome />}>
            <Route index element={<AskDocLoading />} />
            <Route path="/AskDocStep/CheckDocHistory" element={<CheckDocHistory />} />
            <Route path="/AskDocStep/ConfirmDoc" element={<ConfirmDoc />} />
            <Route path="/AskDocStep/ProgressAnalysisDoc" element={<ProgressAnalysisDoc />} />
            <Route path="/AskDocStep/StartAnalysisDoc" element={<StartAnalysisDoc />} />
            <Route path="/AskDocStep/Chat" element={<Chat />} />
          </Route>
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
