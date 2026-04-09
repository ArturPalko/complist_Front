import { useFiltersData } from "../hooks/useFilters/useFiltersData.js";
import {
  getContactsCount
} from "../selectors/selector.js";

import { filterPoints, filterGroups } from "./useFilters/useFiltersFunctions/filtersLogics.js";
import { getAlternativeKeysHelper } from "./useFilters/useFiltersFunctions/helpers.js";
import { useMemo } from "react";

export const useFilterPanelLogic = () => {

  // використовуємо готовий хук для даних
  const {
   activeMenu,
    currentPage,
    filteredChunks,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    dataForMenu,
    isFilterApplied
  } = useFiltersData();

  const groupedFilterPoints = filterPoints[activeMenu] || {};
  const getAlternativeKeys = (key) => getAlternativeKeysHelper(key, filterGroups);
  const contactsCount = useMemo(() => {
    if (!filteredChunks.length || !dataForMenu.length) return ;
    return getContactsCount({
      activeMenu,
      isFilterApplied,
      filteredChunks,
      dataByMenu: dataForMenu
    });
  }, [activeMenu, isFilterApplied, filteredChunks, dataForMenu]);


  return {
   activeMenu,
    currentPage,
    filteredChunks,
    groupedFilterPoints,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    contactsCount
  };
};