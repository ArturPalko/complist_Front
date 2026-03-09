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

import { useTrackLocation } from "./redux/hooks/hooks";
import { Pages } from "./configs/app/constants";

import Login from "./Components/Content/Pages/Login/Login";

import { useSelector } from "react-redux";

function App() {
  useTrackLocation();

  const isLoginOpen = useSelector((state) => state.ui.isLoginOpen);

  return (
    <div className="app-wrapper">
      <Header />
      <NavBar />

      <div className="app-wrapper-content">
        {/* Контент який буде blur */}
        <div className={isLoginOpen ? "content-blur" : ""}>
          <Routes>
            {/* Error */}
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
                element={
                  <RedirectToCurrentPage redirectMenu={Pages.PHONES} />
                }
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
                  element={
                    <RedirectToCurrentPage redirectMenu={Pages.GOV_UA} />
                  }
                />
              </Route>

              {/* Lotus */}
              <Route path="Lotus">
                <Route path="foundResults" element={<FoundResults />} />
                <Route path=":pageNumber" element={<LotusMails />} />
                <Route
                  index
                  element={
                    <RedirectToCurrentPage redirectMenu={Pages.LOTUS} />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </div>

        {/* LOGIN MODAL */}
        {isLoginOpen && <Login />}
      </div>
    </div>
  );
}

export default App;