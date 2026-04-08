import { useDispatch } from "react-redux";
import { useFiltersData } from "../hooks/useFilters/useFiltersData.js";
import {
  getSubFilters,
  currentPageByMenu,
  isFilterAppliedSelector,
  isPresentedFielterPanel,
  getDataForMenu,
  getContactsCount
} from "../selectors/selector.js";

export const useFilterPanelLogic = () => {
  const dispatch = useDispatch();

  // використовуємо готовий хук для даних
  const {
   activeMenu,
    currentPage,
    filteredChunks,
    groupedFilterPoints,
    filterPointsForCurrentMenu,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    dataForMenu,
    isFilterApplied
  } = useFiltersData();

  // додаткові дані, що раніше тягнули зі стора
  // const subFilters = getSubFilters({ activeMenu }); // якщо це функція-селектор
  // const currentPage = currentPageByMenu({ activeMenu });
  // const isFilterApplied = isFilterAppliedSelector(activeMenu)();
  // const isPanelPresented = isPresentedFielterPanel();
  // const dataByMenu = getDataForMenu({ activeMenu });

  // contactsCount можна теж винести у useFiltersData, але поки залишимо так
  const contactsCount = getContactsCount({
    activeMenu,
    isFilterApplied,
    filteredChunks,
    dataForMenu
  });

  return {
   activeMenu,
    currentPage,
    filteredChunks,
    groupedFilterPoints,
    filterPointsForCurrentMenu,
    currentFilters: filtersFromRedux,
    phonesSubConditions,
    hasFilters,
    getAlternativeKeys,
    dispatch
  };
};