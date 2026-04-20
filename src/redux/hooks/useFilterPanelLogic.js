import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getContactsCount, menuSelectors } from "../selectors/selector.js";
import { useFiltersContext } from "../contexts/useConetxt.js";
import { filterPoints, filterGroups } from "./useFilters/useFiltersFunctions/filtersLogics.js";
import { getAlternativeKeysHelper } from "./useFilters/useFiltersFunctions/helpers.js";

export const useFilterPanelLogic = () => {
  const {
    activeMenu,
    currentPage,
    filteredChunks,
    currentFilters,
    phonesSubConditions,
    hasFilters,
    dataForMenu,
    isFilterApplied
  } = useFiltersContext();

  const groupedFilterPoints = filterPoints[activeMenu] || {};

  const getAlternativeKeys = (key) =>
    getAlternativeKeysHelper(key, filterGroups);

const selector = menuSelectors?.[activeMenu];

const selectorResult = useSelector(
  typeof selector === "function" ? selector : () => 0
);

  const contactsCount = useMemo(() => {
    return getContactsCount({
      selectorResult,
      isFilterApplied,
      filteredChunks,
      dataByMenu: dataForMenu
    });
  }, [
    selectorResult,
    isFilterApplied,
    filteredChunks,
    dataForMenu,
    activeMenu
  ]);

  return {
    activeMenu,
    currentPage,
    filteredChunks,
    groupedFilterPoints,
    currentFilters,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    contactsCount
  };
};