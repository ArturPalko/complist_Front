import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';
import GovUaMails from './Components/GovUaMails/GovUaMails';
import LotusMails from './Components/LotusMails/LotusMails';
import Phones from './Components/Phones/Phones';
import { PhonesRedirect, GovUaRedirect, LotusRedirect } from "./Components/RedirectWrapper.jsx"

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />
      <div className="app-wrapper-content">
        <Routes>
          {/* Головний редірект на Gov-ua */}
          <Route path="/" element={<GovUaRedirect />} />

          {/* Роут для Phones */}
          <Route path="/phones">
            <Route path=":pageNumber" element={<Phones />} />
            <Route index element={<PhonesRedirect />} />
          </Route>

          {/* Роут для Mails */}
          <Route path="/mails">
            <Route path="Gov-ua/:pageNumber" element={<GovUaMails />} />
            <Route path="Gov-ua" element={<GovUaRedirect />} />

            <Route path="Lotus/:pageNumber" element={<LotusMails />} />
            <Route path="Lotus" element={<LotusRedirect />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
