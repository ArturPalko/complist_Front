import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addIndexesOfFiltredResults } from "../../reducers/filterData-reducer";
import { syncFilteredIndexesToRedux } from "./useFiltersFunctions/helpers";
import { redirectToPage } from "../../../shared/functions/redirectToPage";

export const useFiltersEffects = ({
  filteredChunks,
  activeMenu,
  hasFilters,
  currentPage
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isFoundResultsPage = location.pathname.includes("foundResults");
  
  const prevChunksRef = useRef([]);
  const prevMenuRef = useRef(null); // відстежуємо попереднє меню тут

  useEffect(() => {
    const prevChunks = prevChunksRef.current;
    const currChunks = filteredChunks;

    if (prevChunks.length !== currChunks.length || JSON.stringify(prevChunks) !== JSON.stringify(currChunks)) {
      syncFilteredIndexesToRedux({ activeMenu, filteredChunks, dispatch, addIndexesOfFiltredResults });
      prevChunksRef.current = currChunks;

      // редірект тільки коли filteredChunks змінилися
      if (!isFoundResultsPage) {
debugger
        // перевіряємо зміни меню прямо тут
        if (prevMenuRef.current !== null && prevMenuRef.current !== activeMenu) {
          debugger
          prevMenuRef.current = activeMenu; // оновлюємо
          return; // пропускаємо редірект
        }

        prevMenuRef.current = activeMenu;

        const nextPage = hasFilters ? 1 : currentPage;
        debugger
        redirectToPage({ navigate, currentPage: nextPage, activeMenu });
      }
    }
  }, [filteredChunks, activeMenu, dispatch, hasFilters, navigate, currentPage, isFoundResultsPage]);
};