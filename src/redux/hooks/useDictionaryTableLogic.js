import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { usePhonesTableLogic } from "./usePhonesTableLogic";

import {
  addUsersModeSelected,
  getCurrentMode,
  isEditModeSelected,
  isSectionsMode,
  selectActiveSectionId,
  selectActiveSectionName,
  selectAtiveDepartmentId,
  selectAtiveDepartmentName,
} from "../selectors/selector";

import { sortUsersActionCreator } from "../reducers/data-reducer/data-reducer";

import { PHONE_TYPES } from "../../configs/app/constants";

export const useDictionaryTableLogic = (props) => {
  // =====================================================
  // BASE TABLE LOGIC
  // =====================================================

  const baseLogic = usePhonesTableLogic(props);

  const dispatch = useDispatch();

  // =====================================================
  // DICTIONARY STATE
  // =====================================================

  const viewMode = useSelector(
    (state) => state.ui.viewMode
  );

  const currentMode = useSelector(getCurrentMode);

  const isSections = useSelector(isSectionsMode);

  const isAddUsers = useSelector(
    addUsersModeSelected
  );

  const activeDep = useSelector(
    selectAtiveDepartmentId
  );

  const activeSec = useSelector(
    selectActiveSectionId
  );

  const departmentName =
    useSelector(selectAtiveDepartmentName);

  const sectionName =
    useSelector(selectActiveSectionName);

  const isEdit = useSelector(
    isEditModeSelected
  );

  // =====================================================
  // PHONE EDIT MODE
  // =====================================================

  const isPhoneEditMode =
    PHONE_TYPES.includes(viewMode);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const showNavigationHeader =
    activeDep != null ||
    activeSec != null;

  // =====================================================
  // USERS SORTING
  // =====================================================

  const [
    sortConfig,
    setSortConfig,
  ] = useState({
    key: null,
    direction: "asc",
  });

  const handleUserSort = (key) => {
    if (currentMode !== "users") {
      return;
    }

    const direction =
      sortConfig.key === key &&
      sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({
      key,
      direction,
    });

    dispatch(
      sortUsersActionCreator(
        key,
        direction
      )
    );
  };

  // =====================================================
  // RETURN
  // =====================================================

  return {
    ...baseLogic,

    // Dictionary state
    currentMode,
    isSections,
    isAddUsers,

    activeDep,
    activeSec,

    departmentName,
    sectionName,

    isEdit,

    // Modes
    isPhoneEditMode,
    showNavigationHeader,

    // Users sorting
    sortConfig,
    handleUserSort,
  };
};