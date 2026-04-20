import React, { useState, useRef } from "react";
import { BottomFilterView } from "./BottomFilterView/BottomFilterView";
import { useBottomFilterLogic } from "../../../redux/hooks/useBottomFilterLogic";
import {
  toggleDept as toggleDeptAction,  
  toggleSubDept as toggleSubDeptAction,
  toggleAutoSelectHideSections,
  toggleAutoSelectHideUsersWithoutSections,
  toggleAllDepatrments
} from "../../../redux/reducers/filter-data-reducer/filterData-reducer";
import { useDispatch } from "react-redux";

export const BottomFilterContainer = () => {
  const dispatch = useDispatch();
  const refs = useRef({});
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

  const {
    activeMenu,
    departments,
    selectedSubDepts,
    selectedOrder,
    bookmarks
  } = useBottomFilterLogic();

  const selectedText =
    selectedOrder.length
      ? selectedOrder.slice(0, 3).join(", ") +
        (selectedOrder.length > 3 ? ` +${selectedOrder.length - 3} ще` : "")
      : "Обрати підрозділи";


  const onToggleSelectAll = () =>
    dispatch(toggleAllDepatrments(activeMenu, departments));

  const onToggleHideUsers = () =>
   dispatch(toggleAutoSelectHideUsersWithoutSections(activeMenu));

  const onToggleHideSections = () =>
    dispatch(toggleAutoSelectHideSections(activeMenu));

  const onToggleSubDept = (dept, sub) =>
    dispatch(toggleSubDeptAction(activeMenu, dept, sub));
        const toggleExpand = (deptName) => {
        setExpandedDept(expandedDept === deptName ? null : deptName);
      };
  const onToggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);
    dispatch(toggleDeptAction(activeMenu, deptName, dept?.sections || []));
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
      selectedText={selectedText}
      onToggleDept={onToggleDept}
      bookmarks = {bookmarks}
      refs = {refs}
      onToggleSelectAll= {onToggleSelectAll}
      onToggleHideUsers={onToggleHideUsers}
      onToggleHideSections= {onToggleHideSections}
      onToggleSubDept={onToggleSubDept}

    />
  );
};

export default BottomFilterContainer;