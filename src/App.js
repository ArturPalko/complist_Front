import "./App.css";
import Header from "./Components/Header/Header";
import NavBar from "./Components/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";

import GovUaMails from "./Components/Content/Pages/GovUaMails/GovUaMails";
import LotusMails from "./Components/Content/Pages/LotusMails/LotusMails";
import Phones from "./Components/Content/Pages/Phones/Phones";
import RedirectToCurrentPage from "./shared/components/navigation/RedirectToCurrentPage/RedirectToCurrentPage";
import Error from "./Components/UI/Error/Error";
import FoundResults from "./Components/FoundResults/FoundResults";
import Login from "./Components/ModalWindows/Login/Login";

import { useTrackLocation } from "./redux/hooks/hooks";
import { Pages } from "./configs/app/constants";

import { useLoginModal } from "./redux/hooks/useLoginModal";
import { useCheckAuth } from "./redux/hooks/hooks";
import { useFiltersData } from "./redux/hooks/useFilters/useFiltersData";
import { useFiltersEffects } from "./redux/hooks/useFilters/useFiltersEffects";
import { FiltersContext } from "./redux/contexts/useConetxt";
import {DragProvider} from "./redux/providers/provider"

function App() {
  useTrackLocation();
  useCheckAuth();

  const { isLoginOpen, closeModal } = useLoginModal();
  const filtersData = useFiltersData();

  useFiltersEffects(filtersData);

  return (
    <>
    <DragProvider>
      <FiltersContext.Provider value={filtersData}>
        <div className="app-wrapper">
          <Header />
          <NavBar />

          <div className="app-wrapper-content">
            <div className={isLoginOpen ? "content-blur" : ""}>
              <Routes>
                <Route path="/error" element={<Error />} />
                <Route
                  path="/"
                  element={<RedirectToCurrentPage redirectMenu={Pages.GOV_UA} />}
                />

                <Route path="/phones">
                  <Route path="foundResults" element={<FoundResults />} />
                  <Route path=":pageNumber" element={<Phones />} />
                  <Route
                    index
                    element={<RedirectToCurrentPage redirectMenu={Pages.PHONES} />}
                  />
                </Route>

                <Route path="/mails">
                  <Route path="Gov-ua">
                    <Route path="foundResults" element={<FoundResults />} />
                    <Route path=":pageNumber" element={<GovUaMails />} />
                    <Route
                      index
                      element={<RedirectToCurrentPage redirectMenu={Pages.GOV_UA} />}
                    />
                  </Route>

                  <Route path="Lotus">
                    <Route path="foundResults" element={<FoundResults />} />
                    <Route path=":pageNumber" element={<LotusMails />} />
                    <Route
                      index
                      element={<RedirectToCurrentPage redirectMenu={Pages.LOTUS} />}
                    />
                  </Route>
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </FiltersContext.Provider>
      </DragProvider>
      
      {isLoginOpen && <Login onClose={closeModal} />}
    </>
  );
}

export default App;