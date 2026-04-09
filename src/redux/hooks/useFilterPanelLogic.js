import { useMemo } from "react";
import { getContactsCount } from "../selectors/selector.js";
import { useFiltersContext } from "../contexts/useConetxt.js";
import { filterPoints, filterGroups } from "./useFilters/useFiltersFunctions/filtersLogics.js";
import { getAlternativeKeysHelper } from "./useFilters/useFiltersFunctions/helpers.js";

export const useFilterPanelLogic = () => {
  // Беремо дані з контексту (FiltersProvider має їх передавати)
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

debugger
  // Групуємо фільтри для UI
  const groupedFilterPoints = filterPoints[activeMenu] || {};

  // Функція для отримання альтернативних ключів
  const getAlternativeKeys = (key) => getAlternativeKeysHelper(key, filterGroups);

  // Підрахунок контактів (мемоізовано)
  const contactsCount = useMemo(() => {
    if (!filteredChunks.length || !dataForMenu.length) return 0;

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
    currentFilters,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    contactsCount
  };
};