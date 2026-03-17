import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  activeMenu,
  getDepartmentsAndSections,
  selectBookmarks
} from "../../../redux/selectors/selector";

import {
  setBookmark,
  toggleSubDept as toggleSubDeptAction
} from "../../../redux/reducers/filterData-reducer";

import { BottomFilterView } from "./BottomFilterView/BottomFilterView";
import { useFilters } from "../../../redux/hooks/useFilters/useFilters";
import { currentPageByMenu } from "../../../redux/selectors/selector";

export const BottomFilterContainer = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

  const depSec = useSelector(getDepartmentsAndSections);
  const departments = depSec.departments || [];
  const bookmarks = useSelector(selectBookmarks);

  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;

  // ================== useFilters ==================
  const menu = useSelector(activeMenu);
const currentPage = useSelector(state => currentPageByMenu(state, menu));
  const phonesData = useSelector(state => state.data.phones);
const { filteredChunks, hasFilters, phonesSubConditions, _ } = useFilters({
  activeMenu: "phones",
  dataForMenu: phonesData,
  currentPage: currentPage
});
  // ================== HANDLERS ==================
  const toggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);
    dispatch(setBookmark(deptName, dept?.sections || []));
  };

  const toggleSubDept = (deptName, sub) => {
    dispatch(toggleSubDeptAction(deptName, sub));
  };

  const toggleExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  return (
    <BottomFilterView
      isOpen={isOpen}
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

