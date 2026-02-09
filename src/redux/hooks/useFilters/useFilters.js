import { useMemo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// ---------------- CONFIG ----------------
import {
  filterGroups,
  conditions,
  filterPoints
} from "./useFiltersFunctions/filtersLogics";

// ---------------- HELPERS ----------------
import {
  hasAnyFilters,
  getAlternativeKeysHelper,
  generatePhonesSubConditions
} from "./useFiltersFunctions/helpers";

import { computeFilteredChunks } from "./useFiltersFunctions/computeFilteredChunks";
import { redirectToCurrentPage } from "./useFiltersFunctions/redirectToCurrentPage";

// ---------------- REDUX ----------------
import {
  addFilter,
  addFilteredDataSubconditions,
  clearCurrentForm,
  addIndexesOfFiltredResults
} from "../../reducers/filterData-reducer";

import {
  selectFiltersForMenu,
  selectPhonesSubcondions,
  isCurrentPageFoundResult
} from "../../selectors/selector";


// =====================================================
// HOOK
// =====================================================

export const useFilters = ({ activeMenu, dataForMenu, currentPage }) => {

  // ---------------- CORE ----------------

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // =====================================================
  // SELECTORS (RAW STATE FROM REDUX)
  // =====================================================

  const filtersFromRedux =
    useSelector(selectFiltersForMenu(activeMenu)) || {};

  const subFiltersFromRedux =
    useSelector(selectPhonesSubcondions) ||
    { contactType: {}, userPosition: {} };

  const isLastVisitedPageWasFoundResults =
    useSelector(isCurrentPageFoundResult(activeMenu));


  // =====================================================
  // DERIVED STATE (COMPUTED VALUES)
  // =====================================================

  // alternative keys resolver
  const getAlternativeKeys = (key) =>
    getAlternativeKeysHelper(key, filterGroups);


  // phones subConditions
  const phonesSubConditions = useMemo(
    () =>
      generatePhonesSubConditions(
        subFiltersFromRedux,
        activeMenu
      ),
    [subFiltersFromRedux, activeMenu]
  );


  // has filters flag
  const hasFilters = useMemo(
    () =>
      hasAnyFilters(
        filtersFromRedux,
        phonesSubConditions
      ),
    [filtersFromRedux, phonesSubConditions]
  );


  // filtered result indexes
  const filteredChunks = useMemo(() => {

    if (!hasFilters) return [];

    return computeFilteredChunks({

      state: filtersFromRedux,
      subConditions: phonesSubConditions,
      activeMenu,
      dataForMenu,
      conditions

    });

  }, [
    hasFilters,
    filtersFromRedux,
    phonesSubConditions,
    activeMenu,
    dataForMenu
  ]);


  // UI filter points
  const groupedFilterPoints =
    filterPoints[activeMenu] || {};

  const filterPointsForCurrentMenu =
    useMemo(
      () => Object.values(groupedFilterPoints).flat(),
      [groupedFilterPoints]
    );


  // =====================================================
  // EFFECTS
  // =====================================================

  // sync filtered indexes to redux
  useEffect(() => {

    if (!activeMenu) return;

    dispatch(
      addIndexesOfFiltredResults(
        activeMenu,
        filteredChunks
      )
    );

  }, [
    filteredChunks,
    activeMenu,
    dispatch
  ]);


  // redirect on filter state change
  const prevHasFiltersRef =
    useRef(hasFilters);

  useEffect(() => {

    if (
      prevHasFiltersRef.current !== hasFilters
    ) {

      redirectToCurrentPage({

        hasFilters,
        lastPageWasFoundResults: isLastVisitedPageWasFoundResults,
        navigate,
        activeMenu,
        currentPage

      });

      prevHasFiltersRef.current =
        hasFilters;

    }

  }, [
    hasFilters,
    isLastVisitedPageWasFoundResults,
    navigate,
    activeMenu,
    currentPage
  ]);


  // =====================================================
  // HANDLERS
  // =====================================================

  const handleCheckboxChange =
    (key, category) => {

      if (
        activeMenu === "phones" &&
        category
      ) {

        dispatch(
          addFilteredDataSubconditions(
            key,
            category
          )
        );

      }
      else {

        dispatch(
          addFilter(
            activeMenu,
            key
          )
        );

      }

    };


  const handleOnClearFormButtonClick =
    () => {

      dispatch(
        clearCurrentForm(
          activeMenu
        )
      );

      dispatch(
        addIndexesOfFiltredResults(
          activeMenu,
          []
        )
      );

    };


  // =====================================================
  // PUBLIC API
  // =====================================================

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


