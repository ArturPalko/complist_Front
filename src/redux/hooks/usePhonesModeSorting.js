import { useState } from "react";
import { useDispatch } from "react-redux";
import { sortPhonesActionCreator } from "../reducers/data-reducer/data-reducer";

export const usePhonesModeSorting = (phoneType) => {
  const dispatch = useDispatch();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handlePhoneSort = (key) => {
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
      sortPhonesActionCreator(
        phoneType,
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
    handlePhoneSort,
    renderSortArrow,
  };
};