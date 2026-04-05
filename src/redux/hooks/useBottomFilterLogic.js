// useBottomFilterLogic.js
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import {useFiltersCore} from "./useFilters/useFilters"

import {
  setBookmark,
  toggleSubDept as toggleSubDeptAction
} from "../reducers/filterData-reducer";
import {
  getDepartmentsAndSections,
  selectBookmarks
} from "../selectors/selector";



export const useBottomFilterLogic = () => {
  const dispatch = useDispatch();
  const [expandedDept, setExpandedDept] = useState(null);

  const { activeMenu, filteredChunks, hasFilters } = useFiltersCore();

  const depSec = useSelector(state =>
    getDepartmentsAndSections(state, activeMenu)
  );

  const departments = depSec?.departments || [];

  const bookmarks = useSelector(state =>
    selectBookmarks(state, activeMenu)
  ) || {};

  const selectedSubDepts = bookmarks.selectedSubDepts || {};
  const selectedOrder = bookmarks.selectedOrder || [];

  const toggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);

    dispatch(setBookmark(activeMenu, deptName, dept?.sections || []));
  };

  const toggleSubDept = (deptName, sub) => {
    dispatch(toggleSubDeptAction(activeMenu, deptName, sub));
  };

  const toggleExpand = (deptName) => {
    setExpandedDept(prev => (prev === deptName ? null : deptName));
  };

  return {
    filteredChunks,
    hasFilters,
    departments,
    expandedDept,
    selectedSubDepts,
    selectedOrder,
    toggleDept,
    toggleSubDept,
    toggleExpand
  };
};