
import { useFiltersData } from "./useFilters/useFiltersData";

export const useBottomFilterLogic = () => {

  // ================== AUTOMATIC ACTIVE MENU ==================
  const { filteredChunks, hasFilters, phonesSubConditions, activeMenu, bookmarks, depSec, } = useFiltersData({ });

  const departments = depSec.departments || [];
  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;

  return {
    activeMenu,
    departments,
    selectedSubDepts,
    selectedOrder,
    filteredChunks,
    hasFilters,
    phonesSubConditions
  };
};