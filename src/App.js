import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import Content from './Components/Content/Content';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="app-wrapper">
        <Header />
        <NavBar />
    <div className="app-wrapper-content">
    <Content/>
    </div>
  </div>
  );
}

export default App;
