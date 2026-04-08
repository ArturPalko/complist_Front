import { useSelector, useDispatch } from "react-redux";
import {
  activeMenu as selectActiveMenu,
  getDepartmentsAndSections,
  selectBookmarks
} from "../selectors/selector";

import {
  setBookmark,
  toggleSubDept as toggleSubDeptAction
} from "../reducers/filterData-reducer";


import { useFiltersData } from "./useFilters/useFiltersData";

export const useBottomFilterLogic = () => {
  const dispatch = useDispatch();

  // ================== AUTOMATIC ACTIVE MENU ==================
  const { filteredChunks, hasFilters, phonesSubConditions, activeMenu } = useFiltersData({ });

  const depSec = useSelector(state => getDepartmentsAndSections(state, activeMenu));
  const departments = depSec.departments || [];
  
  const bookmarks = useSelector(state => selectBookmarks(state, activeMenu)) || [];
  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;

  return {
    activeMenu,
    departments,
    selectedSubDepts,
    selectedOrder,
    toggleDept,
    toggleSubDept,
    filteredChunks,
    hasFilters,
    phonesSubConditions
  };
};