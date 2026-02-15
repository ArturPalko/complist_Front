import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// ---------------- CONFIG ----------------
import { filterGroups, conditions, filterPoints } from "./useFiltersFunctions/filtersLogics";

// ---------------- HELPERS ----------------
import {
  hasAnyFilters,
  getAlternativeKeysHelper,
  generatePhonesSubConditions,
  syncFilteredIndexesToRedux
} from "./useFiltersFunctions/helpers";

import { computeFilteredChunks } from "./useFiltersFunctions/computeFilteredChunks";
import { redirectToCurrentPage } from "./useFiltersFunctions/redirectToCurrentPage";
import { handleCheckboxChangeHelper } from "./useFiltersFunctions/handlers/handleOnCheckboxChange";
import { clearFormHelper } from "./useFiltersFunctions/handlers/handleOnClearFormButtonClick";
import { addIndexesOfFiltredResults } from "../../reducers/filterData-reducer";

// ---------------- REDUX SELECTORS ----------------
import {
  selectFiltersForMenu,
  selectPhonesSubcondions,
  isCurrentPageFoundResult,
} from "../../selectors/selector"; 

export const useFilters = ({ activeMenu, dataForMenu, currentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // ================== SELECTORS ==================
  const filtersFromRedux = useSelector(selectFiltersForMenu(activeMenu)) || {};
  const subFiltersFromRedux = useSelector(selectPhonesSubcondions) || { contactType: {}, userPosition: {} };
  const isLastVisitedPageWasFoundResults = useSelector(isCurrentPageFoundResult(activeMenu));
  // ================== DERIVED STATE ==================
  const getAlternativeKeys = (key) => getAlternativeKeysHelper(key, filterGroups);

  const phonesSubConditions = useMemo(
    () => generatePhonesSubConditions(subFiltersFromRedux, activeMenu),
    [subFiltersFromRedux, activeMenu]
  );

  const hasFilters = useMemo(
    () => hasAnyFilters(filtersFromRedux, phonesSubConditions),
    [filtersFromRedux, phonesSubConditions]
  );

  const filteredChunks = useMemo(() => {
    if (!hasFilters) return [];
    return computeFilteredChunks({
      state: filtersFromRedux,
      subConditions: phonesSubConditions,
      activeMenu,
      dataForMenu,
      conditions
    });
  }, [hasFilters, filtersFromRedux, phonesSubConditions, activeMenu, dataForMenu]);

  // UI filter points
  const groupedFilterPoints = filterPoints[activeMenu] || {};
  const filterPointsForCurrentMenu = useMemo(
    () => Object.values(groupedFilterPoints).flat(),
    [groupedFilterPoints]
  );

  // ================== EFFECTS ==================
  useEffect(() => {
    // синхронізація відфільтрованих індексів у Redux
    syncFilteredIndexesToRedux({ activeMenu, filteredChunks, dispatch, addIndexesOfFiltredResults });
  }, [filteredChunks, activeMenu, dispatch]);

  useEffect(() => {
  redirectToCurrentPage({
    hasFilters,
    isLastVisitedPageWasFoundResults,
    navigate,
    activeMenu,
    currentPage
  });
}, [
  hasFilters,
  // включаємо окремо контакт типи і посади
  subFiltersFromRedux.contactType,
  subFiltersFromRedux.userPosition,
  filtersFromRedux,
  //isLastVisitedPageWasFoundResults,
  // currentPage
]);


  // ================== HANDLERS ==================
  const handleCheckboxChange = (key, category) =>
    handleCheckboxChangeHelper({ activeMenu, key, category, dispatch });

  const handleOnClearFormButtonClick = () =>
    clearFormHelper({ activeMenu, dispatch });

  return {
    filteredChunks,
    groupedFilterPoints,
    filterPointsForCurrentMenu,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    handleCheckboxChange,
    handleOnClearFormButtonClick
  };
};
