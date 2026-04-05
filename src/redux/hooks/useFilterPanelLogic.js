import { useDispatch } from "react-redux";
import { useFiltersCore } from "./useFilters/useFilters";

import { filterPoints, filterGroups } from "./useFilters/useFiltersFunctions/filtersLogics";
import { getAlternativeKeysHelper } from "./useFilters/useFiltersFunctions/helpers";
import { handleCheckboxChangeHelper } from "./useFilters/useFiltersFunctions/handlers/handleOnCheckboxChange";
import { clearFormHelper } from "./useFilters/useFiltersFunctions/handlers/handleOnClearFormButtonClick";

export const useFilterPanelLogic = () => {
  const dispatch = useDispatch();

  const {
    activeMenu,
    filteredChunks,
    phonesSubConditions,
    filtersFromRedux
  } = useFiltersCore();

  // === Груповані фільтри ===
  const groupedFilterPoints = filterPoints[activeMenu] || {};

  // === Дефолтні дані для безпеки ===
  const safeFilteredChunks = filteredChunks.map(chunk => ({
    ...chunk,
    departmentMails: chunk.departmentMails || []
  }));

  // === Функції допомоги ===
  const getAlternativeKeys = (key) => getAlternativeKeysHelper(key, filterGroups);

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
    groupedFilterPoints,
    filteredChunks: safeFilteredChunks, // Передаємо безпечні дані
    phonesSubConditions,
    currentFilters: filtersFromRedux,
    getAlternativeKeys,
    handleCheckboxChange,
    handleOnClearFormButtonClick
  };
};