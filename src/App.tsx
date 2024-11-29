import { useEffect } from 'react';
import useInitApp from 'components/hooks/useInitApp';
import Nova from 'pages/Nova/Nova';
import { Route, Routes } from 'react-router-dom';

import Confirm from './components/Confirm';
import Spinner from './components/Spinner';
import Toast from './components/toast/Toast';
import Alli from './pages/Alli/Alli';
import AskDoc from './pages/AskDoc';
import AskDocHome from './pages/AskDocStep/AskDocHome';
import AskDocLoading from './pages/AskDocStep/AskDocLoading';
import Chat from './pages/AskDocStep/Chat';
import CheckDocHistory from './pages/AskDocStep/CheckDocHistory';
import ConfirmDoc from './pages/AskDocStep/ConfirmDoc';
import ProgressAnalysisDoc from './pages/AskDocStep/ProgressAnalysisDoc';
import StartAnalysisDoc from './pages/AskDocStep/StartAnalysisDoc';
import InvalidAccess from './pages/InvalidAccess';
import ShareChat from './pages/Nova/ShareChat';
import Offline from './pages/Offline';
import TextToImage from './pages/TextToImage';
import Tools from './pages/Tools';
import { setPageStatus } from './store/slices/nova/pageStatusSlice';
import { useAppDispatch } from './store/store';
import GlobalStyle from './style/globalStyle';
import { ClientType, getPlatform, useInitBridgeListener } from './util/bridge';

function App() {
  const initBridgeListener = useInitBridgeListener();
  const initApp = useInitApp();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchInit = async () => {
      if (getPlatform() === ClientType.windows || getPlatform() === ClientType.mac) {
        dispatch(setPageStatus({ tab: 'aiChat', status: 'progress' }));
      }

      await initBridgeListener();
      await initApp();
    };

    fetchInit();
  }, []);

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
          <Route path="/NOVA/share/:id" element={<ShareChat />} />
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
