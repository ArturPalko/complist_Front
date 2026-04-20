import React, { useState } from "react";
import { BottomFilterView } from "./BottomFilterView/BottomFilterView";
import { useBottomFilterLogic } from "../../../redux/hooks/useBottomFilterLogic";
import { toggleDept as toggleDeptAction,   toggleSubDept as toggleSubDeptAction } from "../../../redux/reducers/filter-data-reducer/filterData-reducer";
import { useDispatch } from "react-redux";

export const BottomFilterContainer = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

  const {
    activeMenu,
    departments,
    selectedSubDepts,
    selectedOrder
  } = useBottomFilterLogic();

     const toggleExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };
    const toggleDept = (deptName) => {
      const dept = departments.find(d => d.departmentName === deptName);
      dispatch(toggleDeptAction(activeMenu, deptName, dept?.sections || []));
    };
  
    const toggleSubDept = (deptName, sub) => {
      dispatch(toggleSubDeptAction(activeMenu, deptName, sub));
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