import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// import { getDepartmentsAndSections } from "../../selectors/selector";

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
import {buildBookmarkConditions} from "../useFilters/useFiltersFunctions/buildBookmarkConditions"
import { addIndexesOfFiltredResults } from "../../reducers/filterData-reducer";
import { redirectToCurrentPage } from "./useFiltersFunctions/redirectToCurrentPage";

// ---------------- REDUX SELECTORS ----------------
import {
  activeMenu as selectActiveMenu,
  getDepartmentsAndSections,
    currentPageByMenu,
  getDataForMenu,
  selectFiltersForMenu,
  selectPhonesSubcondions,
  isCurrentPageFoundResult,
  selectBookmarks,
  getSubFilters,
  isFilterAppliedSelector
} from "../../selectors/selector";
import { useLocation } from "react-router-dom";


export const useFilters = ({  }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const activeMenu = useSelector(selectActiveMenu);
    const currentPage = useSelector(state => currentPageByMenu(state, activeMenu));
    const dataForMenu = useSelector(state => getDataForMenu(state, activeMenu));
  // ================== SELECTORS ==================
  const filtersFromRedux = useSelector(selectFiltersForMenu(activeMenu)) || {};
  const subFiltersFromRedux = useSelector(selectPhonesSubcondions) || { contactType: {}, userPosition: {} };
  const bookmarks = useSelector(state => selectBookmarks(state, activeMenu)) || [];

  const selectedSubDepts = bookmarks.selectedSubDepts || {};
  



  const depSec = useSelector(state => getDepartmentsAndSections(state, activeMenu));
  
    const departments = depSec.departments || [];

  // ================== BOOKMARK CONDITIONS ==================

  const bookmarkConditions = useMemo(
    () => buildBookmarkConditions(selectedSubDepts, bookmarks),
    [selectedSubDepts, bookmarks]
  );

  const hasBookmarks =
    Object.keys(selectedSubDepts).length > 0 ||
    Object.values(bookmarks.hideUsersWithoutSections || {}).some(Boolean) ||
    Object.values(bookmarks.hideSections || {}).some(Boolean);

  // ================== DERIVED STATE ==================
  const getAlternativeKeys = (key) => getAlternativeKeysHelper(key, filterGroups);

  const phonesSubConditions = useMemo(
    () => generatePhonesSubConditions(subFiltersFromRedux, activeMenu),
    [subFiltersFromRedux, activeMenu]
  );

  const hasFilters = useMemo(
    () => hasAnyFilters(filtersFromRedux, phonesSubConditions) || hasBookmarks,
    [filtersFromRedux, phonesSubConditions, hasBookmarks]
  );

  // ================== FILTERED CHUNKS ==================
  const filteredChunks = useMemo(() => {
    if (!hasFilters) return [];

    return computeFilteredChunks({
      state: filtersFromRedux,
      subConditions: phonesSubConditions,
      bookmarkConditions,
      activeMenu,
      dataForMenu,
      conditions,
      selectedSubDepts,
      departments
    });
  }, [
    hasFilters,
    filtersFromRedux,
    phonesSubConditions,
    bookmarkConditions,
    activeMenu,
    dataForMenu,
    selectedSubDepts
  ]);

  // ================== UI FILTER POINTS ==================
  const groupedFilterPoints = filterPoints[activeMenu] || {};
  const filterPointsForCurrentMenu = useMemo(
    () => Object.values(groupedFilterPoints).flat(),
    [groupedFilterPoints]
  );

  // ================== EFFECTS ==================
  useEffect(() => {
    syncFilteredIndexesToRedux({
      activeMenu,
      filteredChunks,
      dispatch,
      addIndexesOfFiltredResults
    });
  }, [filteredChunks, activeMenu, dispatch]);


const location = useLocation();
const isFoundResultsPage = location.pathname.includes("foundResults");

  useEffect(() => {
    
  
     if ( isFoundResultsPage) return;

    redirectToCurrentPage({
      hasFilters,
      navigate,
      activeMenu,
      currentPage
    });
  }, [hasFilters, activeMenu, filteredChunks]);


  return {
    activeMenu,
    filteredChunks,
    groupedFilterPoints,
    filterPointsForCurrentMenu,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    dataForMenu
  };
};