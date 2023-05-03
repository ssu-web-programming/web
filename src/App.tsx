import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Presentation from './pages/Presentation';
import Wrapper from './components/Wrapper';
import ToastMsg from './components/ToastMsg';
import { useAppSelector } from './store/store';
import { selectToast } from './store/slices/toastSlice';
import TextToImage from './pages/TextToImage';
import GlobalStyle from './style/globalStyle';

function App() {
  const toast = useAppSelector(selectToast);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <Wrapper>
        <Routes>
          <Route path="/tools" element={<Tools></Tools>}></Route>
          <Route path="/texttoimage" element={<TextToImage></TextToImage>}></Route>
          <Route path="/presentation" element={<Presentation></Presentation>}></Route>
        </Routes>
        {toast.active && <ToastMsg msg={toast.msg} />}
      </Wrapper>
    </>
  );
}

export default App;
