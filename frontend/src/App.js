import {ChangeEditPage} from './pages/ChangeEditPage/ChangeEditPage.js';
import LoginPage from './pages/Login/Login.js';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>
          <a href="/login">Login</a><br />
          <a href="/submitchange">Submit change</a>
          </div>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/submitchange" element={<ChangeEditPage />} />
      </Routes>
    </>
  );
}

export default App;
