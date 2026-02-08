import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { filterGroups, conditions, filterPoints } from "./useFiltersFunctions/filtersLogics";
import { computeFilteredChunks } from "./useFiltersFunctions/computeFilteredChunks";
import { redirectToCurrentPage as redirectUtil } from "./useFiltersFunctions/redirectToCurrentPage";

import {
  addFilter,
  addFilteredDataSubconditions,
  clearCurrentForm,
  addIndexesOfFiltredResults
} from "../../reducers/filterData-reducer";

import { selectFiltersForMenu, selectPhonesSubcondions } from "../../selectors/selector";
import { isCurrentPageFoundResult } from "../../selectors/selector";

export const useFilters = ({ activeMenu, dataForMenu, currentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- SELECTORS ----------------
   const isFoundResults = useSelector(isCurrentPageFoundResult(activeMenu));
  const filtersFromRedux = useSelector(selectFiltersForMenu(activeMenu)) || {};
  const subFiltersFromRedux = useSelector(selectPhonesSubcondions) || { contactType: {}, userPosition: {} };

  // ---------------- HELPERS ----------------
  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter(k => filterGroups[k]?.includes(key));
    return [...direct, ...reverse];
  };

  const hasAnyFilters = (filtersObj = {}, subconditionsObj = {}) => {
    const hasMain = Object.entries(filtersObj)
      .filter(([key]) => key !== "subFilters")
      .some(([, value]) => value === true);

    const hasSub = Object.values(subconditionsObj).some(category =>
      category && Object.keys(category).length > 0
    );

    return hasMain || hasSub;
  };

  // ---------------- SUBCONDITIONS ----------------
  const phonesSubConditions = useMemo(() => {
    if (activeMenu !== "phones") return {};

    const result = {};
    Object.entries(subFiltersFromRedux).forEach(([category, keysObj]) => {
      if (!keysObj || Object.keys(keysObj).length === 0) return;

      result[category] = {};
      Object.entries(keysObj).forEach(([key, isActive]) => {
        if (!isActive) return;
        result[category][key] = (row) => {
          if (category === "contactType") return row.userType === key;
          if (category === "userPosition") return row.userPosition === key;
          return false;
        };
      });

      if (Object.keys(result[category]).length === 0) delete result[category];
    });

    return result;
  }, [subFiltersFromRedux, activeMenu]);

  // ---------------- FILTERING ----------------
  const filteredChunks = useMemo(() => {
    const subConditions = activeMenu === "phones" ? phonesSubConditions : {};
    if (!hasAnyFilters(filtersFromRedux, subConditions)) return [];

    return computeFilteredChunks({
      state: filtersFromRedux,
      subConditions,
      activeMenu,
      dataForMenu,
      conditions
    });
  }, [filtersFromRedux, phonesSubConditions, activeMenu, dataForMenu]);

  // ---------------- UPDATE STORE ----------------
  // завжди оновлюємо індекси відфільтрованих результатів
  useMemo(() => {
    if (!activeMenu) return;
    dispatch(addIndexesOfFiltredResults(activeMenu, filteredChunks));
  }, [filteredChunks, activeMenu, dispatch]);

  // ---------------- HANDLERS ----------------
  const handleCheckboxChange = (key, category) => {
    let updatedFilters = { ...filtersFromRedux };
    let updatedSubConditions = { ...phonesSubConditions };
  debugger;
    if (activeMenu === "phones" && category) {
      debugger;
      dispatch(addFilteredDataSubconditions(key, category));

      // передаємо очікуваний новий стан вручну
      updatedSubConditions = {
        ...phonesSubConditions,
        [category]: {
          ...phonesSubConditions[category],
          [key]: (row) => {
            if (category === "contactType") return row.userType === key;
            if (category === "userPosition") return row.userPosition === key;
            return false;
          }
        }
      };
    } else {
      debugger;
      dispatch(addFilter(activeMenu, key));
      updatedFilters = {
        ...filtersFromRedux,
        [key]: !filtersFromRedux[key]
      };
    }

    // 🔹 редірект відразу з очікуваним станом
    redirectUtil({
      filters: updatedFilters,
      subConditions: updatedSubConditions,
      lastPageWasFoundResults: isFoundResults,
      hasAnyFiltersFn: hasAnyFilters,
      navigate,
      activeMenu,
      currentPage
    });
  };

  const handleOnClearFormButtonClick = () => {
    dispatch(clearCurrentForm(activeMenu));
    dispatch(addIndexesOfFiltredResults(activeMenu, []));

    const clearedFilters = activeMenu === "phones"
      ? { ...filtersFromRedux, subFilters: { contactType: {}, userPosition: {} } }
      : Object.fromEntries(Object.keys(filtersFromRedux).map(k => [k, false]));

    const clearedSubConditions = activeMenu === "phones"
      ? { contactType: {}, userPosition: {} }
      : {};

    redirectUtil({
      filters: clearedFilters,
      subConditions: clearedSubConditions,
      lastPage: isCurrentPageFoundResult,
      hasAnyFiltersFn: hasAnyFilters,
      navigate,
      activeMenu,
      currentPage
    });
  };

  // ---------------- UI HELPERS ----------------
  const groupedFilterPoints = filterPoints[activeMenu] || {};
  const filterPointsForCurrentMenu = Object.values(groupedFilterPoints).flat();

  return {
    filteredChunks,
    groupedFilterPoints,
    filterPointsForCurrentMenu,
    handleOnClearFormButtonClick,
    getAlternativeKeys,
    currentFilters: filtersFromRedux,
    handleCheckboxChange,
    phonesSubConditions,
  };
};
