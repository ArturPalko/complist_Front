import React, { useState, useRef } from "react";
import { BottomFilterView } from "./BottomFilterView/BottomFilterView";
import { useBottomFilterLogic } from "../../../redux/hooks/useBottomFilterLogic";
import { useDispatch } from "react-redux";

import {
  toggleDept as toggleDeptAction,
  toggleSubDept as toggleSubDeptAction,
  toggleAutoSelectHideSections,
  toggleAutoSelectHideUsersWithoutSections,
  toggleAllDepatrments,
  toggleHideUsersWithoutSections as toggleHideUsersAction,
  toggleHideSections as toggleHideSectionsAction
} from "../../../redux/reducers/filter-data-reducer/filterData-reducer";

import { pageConfigs } from "../../../configs/app/pageConfig";

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

  const config = pageConfigs[activeMenu] || {};
  const showExtraToggles = config?.bookmarks?.showExtraToggles;

  const selectedText =
    selectedOrder.length
      ? selectedOrder.slice(0, 3).join(", ") +
        (selectedOrder.length > 3 ? ` +${selectedOrder.length - 3} ще` : "")
      : "Обрати підрозділи";

  // ----------------------------
  // MULTIPLE SELECT LOGIC
  // ----------------------------

  const onToggleSelectAll = () =>
    dispatch(toggleAllDepatrments(activeMenu, departments));

  const onAutoToggleHideUsers = () =>
    dispatch(toggleAutoSelectHideUsersWithoutSections(activeMenu));

  const onAutoToggleHideSections = () =>
    dispatch(toggleAutoSelectHideSections(activeMenu));

  // ----------------------------
  // SINGLE SELECT LOGIC
  // --------------------------
  const onToggleSubDept = (dept, sub) =>
    dispatch(toggleSubDeptAction(activeMenu, dept, sub));

  const onToggleDept = (deptName) => {
    const dept = departments.find(d => d.departmentName === deptName);
    dispatch(toggleDeptAction(activeMenu, deptName, dept?.sections || []));
  };

  // ----------------------------
  // ADDITIONAL SELECT LOGIC
  // ----------------------------

  const onToggleHideUsers = (deptName) =>
    dispatch(toggleHideUsersAction(activeMenu, deptName));

  const onToggleHideSections = (deptName) =>
    dispatch(toggleHideSectionsAction(activeMenu, deptName));

  const toggleExpand = (deptName) => {
    setExpandedDept(prev =>
      prev === deptName ? null : deptName
    );
  };

  // ----------------------------

  return (
    <BottomFilterView
      isOpen={isOpen}
      toggleOpen={() => setIsOpen(!isOpen)}

      departments={departments}
      expandedDept={expandedDept}
      toggleExpand={toggleExpand}

      selectedSubDepts={selectedSubDepts}
      selectedText={selectedText}

      onToggleDept={onToggleDept}
      onToggleSubDept={onToggleSubDept}

      bookmarks={bookmarks}
      refs={refs}

      onToggleSelectAll={onToggleSelectAll}
      onAutoToggleHideUsers={onAutoToggleHideUsers}
      onAutoToggleHideSections={onAutoToggleHideSections}

      showExtraToggles={showExtraToggles}

      onToggleHideUsers={onToggleHideUsers}
      onToggleHideSections={onToggleHideSections}
    />
  );
};

export default BottomFilterContainer;