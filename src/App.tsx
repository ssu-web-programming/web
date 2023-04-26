import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Presentation from './pages/Presentation';
import Wrapper from './components/Wrapper';
import ToastMsg from './components/ToastMsg';
import { useAppSelector } from './store/store';
import { selectToast } from './store/slices/toastSlice';

function App() {
  const toast = useAppSelector(selectToast);

  return (
    <Wrapper>
      <Routes>
        <Route path="/tools" element={<Tools></Tools>}></Route>
        <Route path="/presentation" element={<Presentation></Presentation>}></Route>
      </Routes>
      {toast.active && <ToastMsg msg={toast.msg} />}
    </Wrapper>
  );
}

export default App;
