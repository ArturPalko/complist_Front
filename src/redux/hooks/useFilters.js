import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getLastVisitedPage } from "../selectors/selector";
import { filterGroups, conditions, filterPoints } from "./useFiltersFunctions/filtersLogics";
import { computeFilteredChunks } from "./useFiltersFunctions/computeFilteredChunks";
import { redirectToCurrentPage as redirectUtil } from "./useFiltersFunctions/redirectToCurrentPage";
import { handleOnCheckboxChangeHandler } from "./useFiltersFunctions/handlers/handleOnCheckboxChange";
import { handleOnClearFormButtonClickHandler } from "./useFiltersFunctions/handlers/handleOnClearFormButtonClick";

const CHUNK_SIZE = 18;

export const useFilters = (props = {}) => {
  const {
    activeMenu,
    getGovUaMails,
    getLotusMails,
    getPhones,
    getSubFilters,
    addIndexesOfFiltredResults,
    addFilter,
    clearCurrentForm,
    GovUaCurrentPage,
    lotusCurrentPage,
    phonesCurrentPage,
    isPresentedFielterPanel
  } = props;

  const navigate = useNavigate();
  const lastPage = useSelector((state) => getLastVisitedPage(state, activeMenu));

  const [phonesSubConditions, setPhonesSubConditions] = useState({});
  const [lotusFilters, setLotusFilters] = useState({});
  const [govUaFilters, setGovUaFilters] = useState({});
  const [phonesFilters, setPhonesFilters] = useState({});

  const currentFilters =
    activeMenu === "Lotus"
      ? lotusFilters
      : activeMenu === "Gov-ua"
      ? govUaFilters
      : phonesFilters;

  const prevChunks = useRef([]);

  // ---------------- HELPERS ----------------
  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) =>
      filterGroups[k]?.includes(key)
    );
    return [...direct, ...reverse];
  };

  const hasAnyFilters = (filters = {}, subConditions = {}) => {
    const hasMain = Object.values(filters).some(v => v === true);
    const hasSub = Object.values(subConditions).some(
      group => group && Object.values(group).some(v => v === true || typeof v === "function")
    );
    return hasMain || hasSub;
  };

  // ---------------- REDIRECT ----------------
  const redirectToCurrentPage = (filters = {}, subConditions = phonesSubConditions) => {
    redirectUtil({
      filters,
      subConditions,
      lastPage,
      hasAnyFiltersFn: hasAnyFilters,
      navigate,
      activeMenu,
      GovUaCurrentPage,
      lotusCurrentPage,
      phonesCurrentPage
    });
  };

  // ---------------- SYNC SUBCONDITIONS & REDIRECT ----------------
  useEffect(() => {
    if (activeMenu !== "phones") return;

    const storedSubFilters = getSubFilters || {};
    const result = {};

    Object.entries(storedSubFilters).forEach(([category, keysObj]) => {
      const activeKeys = Object.entries(keysObj || {})
        .filter(([, v]) => v === true)
        .map(([k]) => k);

      if (!activeKeys.length) return;

      result[category] = {};
      activeKeys.forEach((key) => {
        result[category][key] = (row) => {
          if (category === "contactType") return row.userType === key;
          if (category === "userPosition") return row.userPosition === key;
          return false;
        };
      });
    });

    // Оновлюємо саб-фільтри
    setPhonesSubConditions(result);

    // Редирект з актуальними саб-фільтрами
    redirectToCurrentPage(currentFilters, result);

  }, [getSubFilters, activeMenu, currentFilters]);

  // ---------------- HANDLERS ----------------
  const handleCheckboxChange = (key) =>
    handleOnCheckboxChangeHandler({
      key,
      activeMenu,
      lotusFilters,
      setLotusFilters,
      setPhonesSubConditions,
      govUaFilters,
      setGovUaFilters,
      phonesFilters,
      setPhonesFilters,
      phonesSubConditions,
      addFilter,
      redirectToCurrentPage,
      hasAnyFilters,
      clearCurrentForm
    });

  const handleOnClearFormButtonClick = () => {
    handleOnClearFormButtonClickHandler({
      activeMenu,
      setLotusFilters,
      setGovUaFilters,
      setPhonesFilters,
      setPhonesSubConditions,
      clearCurrentForm,
      redirectToCurrentPage
    });
    prevChunks.current = [];
    if (typeof addIndexesOfFiltredResults === "function") {
      addIndexesOfFiltredResults(activeMenu, []);
    }
  };

  // ---------------- FILTERING & DISPATCH ----------------
  const filteredChunks = useMemo(() => {
    if (!hasAnyFilters(currentFilters, phonesSubConditions)) {
      prevChunks.current = [];
      if (typeof addIndexesOfFiltredResults === "function") {
        addIndexesOfFiltredResults(activeMenu, []);
      }
      return [];
    }

    const chunks = computeFilteredChunks({
      state: currentFilters,
      subConditions: phonesSubConditions,
      activeMenu,
      getGovUaMails,
      getLotusMails,
      getPhones,
      conditions,
      chunkSize: CHUNK_SIZE
    });

    if (JSON.stringify(chunks) !== JSON.stringify(prevChunks.current)) {
      if (typeof addIndexesOfFiltredResults === "function") {
        addIndexesOfFiltredResults(activeMenu, chunks);
      }
      prevChunks.current = chunks;
    }

    return chunks;
  }, [
    currentFilters,
    phonesSubConditions,
    activeMenu,
    getGovUaMails,
    getLotusMails,
    getPhones,
    addIndexesOfFiltredResults
  ]);

  // ---------------- UI HELPERS ----------------
  const filterPointsForCurrentMenu = (filterPoints || []).filter((p) =>
    p.pages.includes((activeMenu || "").toLowerCase())
  );

  const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = [];
    acc[item.groupName].push(item);
    return acc;
  }, {});

  // ---------------- RESET WHEN PANEL HIDDEN ----------------
  useEffect(() => {
    if (!isPresentedFielterPanel) {
      setLotusFilters({});
      setGovUaFilters({});
      setPhonesFilters({});
      setPhonesSubConditions({});
      prevChunks.current = [];
      if (typeof addIndexesOfFiltredResults === "function") {
        addIndexesOfFiltredResults(activeMenu, []);
      }
    }
  }, [isPresentedFielterPanel]);

  // ---------------- RETURN ----------------
  return {
    filteredChunks,
    groupedFilterPoints,
    handleOnClearFormButtonClick,
    getAlternativeKeys,
    currentFilters,
    handleCheckboxChange,
    phonesSubConditions,
    filterPoints,
    filterGroups,
    filterPointsForCurrentMenu
  };
};
