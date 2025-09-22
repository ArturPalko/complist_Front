import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';
import GovUaMails from './Components/GovUaMails/GovUaMails';
import LotusMails from './Components/LotusMails/LotusMails';
import Phones from './Components/Phones/Phones';
import RedirectToCurrentPage from './Components/RedirectToCurrentPage';
import { phonesCurrentPage, GovUaCurrentPage, lotusCurrentPage } from "./redux/selectors/selector";

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />
      <div className="app-wrapper-content">
        <Routes>
          {/* Головний редірект на Gov-ua */}
          <Route path="/" element={
            <RedirectToCurrentPage selector={GovUaCurrentPage} buildPath={(page) => `/mails/Gov-ua/${page}`} />
          } />

          {/* Phones */}
          <Route path="/phones">
            <Route path=":pageNumber" element={<Phones />} />
            <Route index element={
              <RedirectToCurrentPage selector={phonesCurrentPage} buildPath={(page) => `/phones/${page}`} />
            } />
          </Route>

          {/* Mails */}
          <Route path="/mails">
            <Route path="Gov-ua/:pageNumber" element={<GovUaMails />} />
            <Route path="Gov-ua" element={
              <RedirectToCurrentPage selector={GovUaCurrentPage} buildPath={(page) => `/mails/Gov-ua/${page}`} />
            } />

            <Route path="Lotus/:pageNumber" element={<LotusMails />} />
            <Route path="Lotus" element={
              <RedirectToCurrentPage selector={lotusCurrentPage} buildPath={(page) => `/mails/Lotus/${page}`} />
            } />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
