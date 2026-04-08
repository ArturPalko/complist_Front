import "./App.css";
import Header from "./Components/Header/Header";
import NavBar from "./Components/NavBar/NavBar";
import { Route, Routes} from "react-router-dom";

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

function App() {
  useTrackLocation();
  useCheckAuth();
  const { isLoginOpen, closeModal } = useLoginModal();

    const {
    activeMenu,
    filteredChunks,
    hasFilters,
    currentPage,
    dispatch
  } = useFiltersData();

  // тепер викликаємо хук ефектів, передаючи потрібні дані
  useFiltersEffects({ activeMenu, filteredChunks, hasFilters, currentPage, dispatch });

  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />

      <div className="app-wrapper-content">
        {/* Контент під модалкою */}
        <div className={isLoginOpen ? "content-blur" : ""}>
          <Routes>
            <Route path="/error" element={<Error />} />

            {/* root → Gov-ua */}
            <Route
              path="/"
              element={<RedirectToCurrentPage redirectMenu={Pages.GOV_UA} />}
            />

            {/* Phones */}
            <Route path="/phones">
              <Route path="foundResults" element={<FoundResults />} />
              <Route path=":pageNumber" element={<Phones />} />
              <Route
                index
                element={<RedirectToCurrentPage redirectMenu={Pages.PHONES} />}
              />
            </Route>

            {/* Mails */}
            <Route path="/mails">
              {/* Gov-ua */}
              <Route path="Gov-ua">
                <Route path="foundResults" element={<FoundResults />} />
                <Route path=":pageNumber" element={<GovUaMails />} />
                <Route
                  index
                  element={<RedirectToCurrentPage redirectMenu={Pages.GOV_UA} />}
                />
              </Route>

              {/* Lotus */}
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

        {/* LOGIN MODAL */}
        {isLoginOpen && <Login onClose={closeModal} />}
      </div>
    </div>
  );
}

export default App;