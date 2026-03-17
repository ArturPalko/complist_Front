import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  selectBookmarks
} from "../../selectors/selector";


export const useFilters = ({ activeMenu, dataForMenu, currentPage }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================== SELECTORS ==================
  const filtersFromRedux = useSelector(selectFiltersForMenu(activeMenu)) || {};

  const subFiltersFromRedux =
    useSelector(selectPhonesSubcondions) ||
    { contactType: {}, userPosition: {} };

  const bookmarks = useSelector(selectBookmarks) || {};
  const selectedSubDepts = bookmarks.selectedSubDepts || {};

  const isLastVisitedPageWasFoundResults =
    useSelector(isCurrentPageFoundResult(activeMenu));

  // ================== BOOKMARK CONDITIONS ==================

  const buildBookmarkConditions = (selectedSubDepts = {}) => {

    const departments = [];
    const sections = {};

    Object.entries(selectedSubDepts).forEach(([dept, value]) => {

      if (value === true) {
        departments.push(dept);
      }

      if (Array.isArray(value)) {
        sections[dept] = value;
      }

    });

    return { departments, sections };

  };

  const bookmarkConditions = useMemo(
    () => buildBookmarkConditions(selectedSubDepts),
    [selectedSubDepts]
  );

  const hasBookmarks =
    Object.keys(selectedSubDepts).length > 0;

  // ================== DERIVED STATE ==================

  const getAlternativeKeys = (key) =>
    getAlternativeKeysHelper(key, filterGroups);

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
      selectedSubDepts
    });

  }, [
    hasFilters,
    filtersFromRedux,
    phonesSubConditions,
    bookmarkConditions,
    activeMenu,
    dataForMenu
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
    subFiltersFromRedux.contactType,
    subFiltersFromRedux.userPosition,
    filtersFromRedux
  ]);

  // ================== HANDLERS ==================

  const handleCheckboxChange = (key, category) =>
    handleCheckboxChangeHelper({
      activeMenu,
      key,
      category,
      dispatch
    });

  const handleOnClearFormButtonClick = () =>
    clearFormHelper({
      activeMenu,
      dispatch
    });

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