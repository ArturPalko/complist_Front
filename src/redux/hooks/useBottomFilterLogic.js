
import { useFiltersContext } from "../contexts/useConetxt";

export const useBottomFilterLogic = () => {

  // ================== AUTOMATIC ACTIVE MENU ==================
  const { filteredChunks, hasFilters, phonesSubConditions, activeMenu, bookmarks, depSec, } = useFiltersContext({ });

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