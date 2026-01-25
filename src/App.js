import './App.css';
import Header from './Components/Header/Header';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';
import GovUaMails from './Components/GovUaMails/GovUaMails';
import LotusMails from './Components/LotusMails/LotusMails';
import Phones from './Components/Phones/Phones';
import RedirectToCurrentPage from './Components/RedirectToCurrentPage';
import { phonesCurrentPage, GovUaCurrentPage, lotusCurrentPage } from "./redux/selectors/selector";
import Error from './Components/Error/Error';
import FoundResults from './Components/FoundResults/FoundResults';
import { useTrackLocation } from './redux/hooks/hooks';
import FilterPanelContainer from './Components/NavBar/FilterPanel/FilterPanelContainer';
import Filter from './Components/NavBar/Filter/Filter';

function App() {
  useTrackLocation();

  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />
      {/* <Filter/> */}

      <div className="app-wrapper-content">
        <Routes>

          {/* Error */}
          <Route path="/error" element={<Error />} />

          {/* Головний редірект на Gov-ua */}
          <Route
            path="/"
            element={
              <RedirectToCurrentPage
                selector={GovUaCurrentPage}
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
                  redirectMenu={"phones"}
                  selector={phonesCurrentPage}
                  buildPath={(page) => `/phones/${page}`}
                />
              }
            />
          </Route>

          {/* Mails */}
          <Route path="/mails">
            <Route path="Gov-ua">
              {/* коли /mails/Gov-ua/1, /mails/Gov-ua/2 тощо */}
              <Route path=":pageNumber" element={<GovUaMails />} />

              {/* коли просто /mails/Gov-ua */}
              <Route
                index
                element={
                  <RedirectToCurrentPage
                    redirectMenu={"Gov-ua"}
                    selector={GovUaCurrentPage}
                    buildPath={(page) => `/mails/Gov-ua/${page}`}
                  />
                }
              />

              {/* коли /mails/Gov-ua/foundResults */}
              <Route path="foundResults" element={<FoundResults />} />
            </Route>

            {/* Lotus */}
            <Route path="Lotus">
              <Route path=":pageNumber" element={<LotusMails />} />
              <Route
                index
                element={
                  <RedirectToCurrentPage
                    redirectMenu ={"Lotus"}
                    selector={lotusCurrentPage}
                    buildPath={(page) => `/mails/Lotus/${page}`}
                  />
                }
              />
              {/* коли /mails/Lotus/foundResults */}
              <Route path="foundResults" element={<FoundResults />} />
            </Route>
          </Route>

        </Routes>
      </div>
    </div>
  );
}

export default App;
