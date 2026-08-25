
import { useFiltersContext } from "../contexts/useConetxt";

export const useBottomFilterLogic = () => {

  // ================== AUTOMATIC ACTIVE MENU ==================
  const { filteredChunks, hasFilters, phonesSubConditions, activeMenu, bookmarks, depSec, } = useFiltersContext({ });

  const departments = [...(depSec.departments || [])].sort((a, b) =>
  a.departmentName.localeCompare(b.departmentName)
);
  debugger
  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;

  return {
    activeMenu,
    departments,
    selectedSubDepts,
    selectedOrder,
    filteredChunks,
    hasFilters,
    phonesSubConditions,
    bookmarks
  };
};