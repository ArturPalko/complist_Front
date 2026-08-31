import { useState } from "react";
import { useDispatch } from "react-redux";

import { sortUsersActionCreator } from "../reducers/data-reducer/data-reducer";

export const useUsersModeSorting = (currentMode) => {
  const dispatch = useDispatch();

  const [sortConfig, setSortConfig] = useState({
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

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === "asc"
      ? "↑"
      : "↓";
  };

  return {
    sortConfig,
    handleUserSort,
    renderSortArrow,
  };
};