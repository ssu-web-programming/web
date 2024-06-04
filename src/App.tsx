import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Toast from './components/toast/Toast';
import { useEffect } from 'react';
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

function App() {
  const initBridgeListener = useInitBridgeListener();

  useEffect(() => {
    initBridgeListener();
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
