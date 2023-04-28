import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Presentation from './pages/Presentation';
import Wrapper from './components/Wrapper';
import ToastMsg from './components/ToastMsg';
import { useAppDispatch, useAppSelector } from './store/store';
import { selectToast } from './store/slices/toastSlice';
import { useEffect } from 'react';
import { setBridgeMessage } from './store/slices/bridge';

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    document.addEventListener('CustomBridgeEvent', (e: any) => {
      dispatch(setBridgeMessage(e.detail));
    });
  }, []);

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
