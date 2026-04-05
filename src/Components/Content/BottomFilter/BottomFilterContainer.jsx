import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  activeMenu as selectActiveMenu,
  getDepartmentsAndSections,
  selectBookmarks
} from "../../../redux/selectors/selector";

import {
  setBookmark,
  toggleSubDept as toggleSubDeptAction
} from "../../../redux/reducers/filterData-reducer";

import { BottomFilterView } from "./BottomFilterView/BottomFilterView";
import { useFilters } from "../../../redux/hooks/useFilters/useFilters";

export const BottomFilterContainer = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

    // ================== AUTOMATIC ACTIVE MENU ==================

  const { filteredChunks, hasFilters, phonesSubConditions,activeMenu } = useFilters({ });

  const depSec = useSelector(state => getDepartmentsAndSections(state, activeMenu));
  
  const departments = depSec.departments || [];
  const bookmarks = useSelector(state => selectBookmarks(state, activeMenu)) || [];

  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;



  // ================== HANDLERS ==================
  const toggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);
    dispatch(setBookmark(activeMenu, deptName, dept?.sections || []));
  };

  const toggleSubDept = (deptName, sub) => {

    dispatch(toggleSubDept(activeMenu, deptName, sub));
  };

  const toggleExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  return (
    <BottomFilterView
      isOpen={isOpen}
      activeMenu={activeMenu}
      toggleOpen={() => setIsOpen(!isOpen)}
      departments={departments}
      expandedDept={expandedDept}
      toggleExpand={toggleExpand}
      selectedSubDepts={selectedSubDepts}
      selectedOrder={selectedOrder}
      toggleDept={toggleDept}
      toggleSubDept={toggleSubDept}
    />
  );
};

export default BottomFilterContainer;