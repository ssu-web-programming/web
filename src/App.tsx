import { useEffect } from 'react';
import useInitApp from 'components/hooks/useInitApp';
import OverlayModal from 'components/overlay-modal';
import RetryComponent from 'components/retry-component';
import { overlay, OverlayProvider } from 'overlay-kit';
import Nova from 'pages/Nova/Nova';
import Translation from 'pages/Nova/Translation';
import ClosedModalContent from 'pages/Nova/VoiceDictation/components/modals/closed-modal-content';
import { useVoiceDictationContext } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import { appStateSelector } from 'store/slices/appState';
import { errorSelector } from 'store/slices/errorSlice';
import { ThemeProvider } from 'styled-components';

import Confirm from './components/Confirm';
import { useChangeBackground } from './components/hooks/nova/useChangeBackground';
import Spinner from './components/Spinner';
import Toast from './components/toast/Toast';
import { NOVA_TAB_TYPE } from './constants/novaTapTypes';
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
import { setPlatformInfo } from './store/slices/platformInfo';
import { setThemeInfo, themeInfoSelector, ThemeType } from './store/slices/theme';
import { useAppDispatch, useAppSelector } from './store/store';
import GlobalStyle from './style/globalStyle';
import { selectTheme } from './theme/theme';
import Bridge, {
  ClientType,
  getDevice,
  getPlatform,
  getVersion,
  useInitBridgeListener
} from './util/bridge';

function App() {
  const initBridgeListener = useInitBridgeListener();
  const initApp = useInitApp();
  const dispatch = useAppDispatch();
  const { curTheme } = useAppSelector(themeInfoSelector);
  const { isClosedNova } = useAppSelector(appStateSelector);
  const { t } = useTranslation();
  const { resetVoiceInfo } = useVoiceDictationContext();

  const platform = getPlatform();
  const version = getVersion();
  const device = getDevice();

  useEffect(() => {
    const detectTheme = () => {
      const platform = getPlatform();
      if (
        platform === ClientType.mac ||
        platform === ClientType.web ||
        platform === ClientType.unknown
      ) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newTheme = prefersDarkMode ? ThemeType.dark : ThemeType.light;
        dispatch(setThemeInfo(newTheme));
      } else {
        dispatch(setThemeInfo(ThemeType.light));
      }
    };

    detectTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchInit = async () => {
      if (getPlatform() === ClientType.windows || getPlatform() === ClientType.mac) {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.home, status: 'progress' }));
      }

      if (!location.pathname.toLowerCase().startsWith('/nova/share')) {
        await initBridgeListener();
        await initApp();
      }
    };

    if (platform != ClientType.unknown && version) {
      dispatch(setPlatformInfo({ platform: platform, device: device, version: version }));
    }
    fetchInit();
  }, []);

  const handleResetVoiceInfo = async () => {
    await Bridge.callBridgeApi('closeNova');
    resetVoiceInfo();
  };

  const openClosedModal = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <ClosedModalContent
            title={t('Nova.voiceDictation.Alert.UnsavedRecording')}
            onConfirm={() => {
              handleResetVoiceInfo();
            }}
            confirmTxt={t('Nova.Confirm.CloseChat.Ok') as string}
            closeTxt={t('Cancel') as string}
          />
        </OverlayModal>
      );
    });
  };

  useEffect(() => {
    // client에서 nova 닫는 요청이 들어올때 해당 closed 버튼을 통해 팝업을 띄우고 닫는다.
    if (isClosedNova) {
      openClosedModal();
    }
  }, [isClosedNova]);

  return (
    <ThemeProvider theme={selectTheme(curTheme)}>
      <OverlayProvider>
        <GlobalStyle />
        <>
          <Routes>
            <Route path="/aiWrite" element={<Tools></Tools>}></Route>
            <Route path="/txt2img" element={<TextToImage></TextToImage>}></Route>
            <Route path="/askdoc" element={<AskDoc />} />
            <Route path="/alli" element={<Alli />} />
            <Route path="/NOVA" element={<Nova />} />
            <Route path="/translation" element={<Translation />} />
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
          <RetryComponent />
        </>
      </OverlayProvider>
    </ThemeProvider>
  );
}

export default App;
