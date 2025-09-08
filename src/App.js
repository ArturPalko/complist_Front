import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GovUaMails from './Components/GovUaMails/GovUaMails';


function App() {
  return (
    <div className="app-wrapper">
        <Header />
        <NavBar />
    <div className="app-wrapper-content">
      <Routes>
        <Route path="/" element={<GovUaMails/>}/>
      </Routes>
    
    </div>
  </div>
  );
}

export default App;
