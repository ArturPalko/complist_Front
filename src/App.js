import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';

import GovUaMails from './Components/GovUaMails/GovUaMails';
import LotusMails from './Components/LotusMails/LotusMails';
import Phones from './Components/Phones/Phones';
import RedirectToCurrentPage from './Components/RedirectToCurrentPage';
import Error from './Components/Error/Error';
import FoundResults from './Components/FoundResults/FoundResults';
import { useTrackLocation } from './redux/hooks/hooks';

function App() {
  useTrackLocation();

  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />

      <div className="app-wrapper-content">
        <Routes>

          <Route path="/error" element={<Error />} />

          {/* root → Gov-ua */}
          <Route
            path="/"
            element={
              <RedirectToCurrentPage
                redirectMenu="Gov-ua"
                buildPath={(page) => `/mails/Gov-ua/${page}`}
              />
            }
          />

          {/* Phones */}
          <Route path="/phones">
            <Route path="foundResults" element={<FoundResults />} />
            <Route path=":pageNumber" element={<Phones />} />
            <Route
              index
              element={
                <RedirectToCurrentPage
                  redirectMenu="phones"
                  buildPath={(page) => `/phones/${page}`}
                />
              }
            />
          </Route>

          {/* Mails */}
          <Route path="/mails">

            <Route path="Gov-ua">
              <Route path=":pageNumber" element={<GovUaMails />} />
              <Route path="foundResults" element={<FoundResults />} />
              <Route
                index
                element={
                  <RedirectToCurrentPage
                    redirectMenu="Gov-ua"
                    buildPath={(page) => `/mails/Gov-ua/${page}`}
                  />
                }
              />
            </Route>

            <Route path="Lotus">
              <Route path=":pageNumber" element={<LotusMails />} />
              <Route path="foundResults" element={<FoundResults />} />
              <Route
                index
                element={
                  <RedirectToCurrentPage
                    redirectMenu="Lotus"
                    buildPath={(page) => `/mails/Lotus/${page}`}
                  />
                }
              />
            </Route>

          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
