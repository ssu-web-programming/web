import { Routes, Route } from 'react-router-dom';
import Tools from './pages/Tools';
import Presentation from './pages/Presentation';
import Wrapper from './components/Wrapper';

function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path="/tools" element={<Tools></Tools>}></Route>
        <Route path="/presentation" element={<Presentation></Presentation>}></Route>
      </Routes>
    </Wrapper>
  );
}

export default App;
