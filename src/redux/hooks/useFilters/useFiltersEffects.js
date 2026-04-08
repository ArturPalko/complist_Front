import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addIndexesOfFiltredResults } from "../../reducers/filterData-reducer";
import { syncFilteredIndexesToRedux } from "./useFiltersFunctions/helpers";
import { redirectToCurrentPage } from "./useFiltersFunctions/redirectToCurrentPage";

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

  // синхронізація фільтрованих індексів в Redux
  useEffect(() => {
    const prev = prevChunksRef.current;
    const curr = filteredChunks;

    // просте порівняння по довжині і JSON.stringify для безпечної перевірки змін
    if (prev.length !== curr.length || JSON.stringify(prev) !== JSON.stringify(curr)) {
      syncFilteredIndexesToRedux({ activeMenu, filteredChunks, dispatch, addIndexesOfFiltredResults });
      prevChunksRef.current = curr;

      // редірект тільки коли filteredChunks змінилися
      if (!isFoundResultsPage) {
        redirectToCurrentPage({ hasFilters, navigate, activeMenu, currentPage });
      }
    }
  }, [filteredChunks, activeMenu, dispatch, hasFilters, navigate, currentPage, isFoundResultsPage]);
};