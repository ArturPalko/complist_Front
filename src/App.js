import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
      <Route path='/phones/:pageNumber' element={<Phones/>}/>
      <Route path="/mails">
                <Route path="Gov-ua/:pageNumber" element={<GovUaMails />} />
                <Route path="Lotus/:pageNumber"  element={<LotusMails />} />
      </Route>
      </Routes>
     
    
    </div>
  </div>
  );
}

export default App;
