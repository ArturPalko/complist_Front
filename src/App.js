import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes, Navigate } from 'react-router-dom';
import GovUaMails from './Components/GovUaMails/GovUaMails';
import LotusMails from './Components/LotusMails/LotusMails';
import Phones from './Components/Phones/Phones';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />
      <div className="app-wrapper-content">
        <Routes>

          <Route path="/" element={<Navigate to="/mails/Gov-ua/1" replace />} />

          <Route path="/phones">
            <Route index element={<Navigate to="/phones/1" replace />} />
            <Route path=":pageNumber" element={<Phones />} />
          </Route>

          <Route path="/mails">
            <Route path="Gov-ua/:pageNumber" element={<GovUaMails />} />
            <Route path="Gov-ua" element={<Navigate to="/mails/Gov-ua/1" replace />} />

            <Route path="Lotus/:pageNumber" element={<LotusMails />} />
            <Route path="Lotus" element={<Navigate to="/mails/Lotus/1" replace />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
