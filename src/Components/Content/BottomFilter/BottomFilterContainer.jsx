import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDepartmentsAndSections, selectBookmarks } from "../../../redux/selectors/selector";
import { setBookmark, toogleSubDept as toggleSubDeptAction } from "../../../redux/reducers/filterData-reducer";
import { BottomFilterView } from "./BottomFilterView/BottomFilterView";

export const BottomFilterContainer = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

  const depSec = useSelector(getDepartmentsAndSections);
  const departments = depSec.departments || [];
  const bookmarks = useSelector(selectBookmarks);

  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;

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