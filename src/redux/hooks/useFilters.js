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

  // ---------------- SYNC SUBCONDITIONS ----------------
  // 1️⃣ useEffect для оновлення саб-фільтрів
useEffect(() => {
  if (activeMenu !== "phones") return;

  const storedSubFilters = getSubFilters || {};
  const result = {};

  Object.entries(storedSubFilters).forEach(([category, keysObj]) => {
    const activeKeys = Object.entries(keysObj || {})
      .filter(([, v]) => v)
      .map(([k]) => k);

    // категорія завжди існує
    result[category] = {};

    activeKeys.forEach((key) => {
      result[category][key] = (row) => {
        if (category === "contactType") return row.userType === key;
        if (category === "userPosition") return row.userPosition === key;
        return false;
      };
    });
  });

  setPhonesSubConditions(result);
}, [getSubFilters, activeMenu]);

// 2️⃣ useEffect для редиректу, тільки для phones
useEffect(() => {
  if (activeMenu !== "phones") return;

  // Викликаємо редирект після оновлення phonesSubConditions
  redirectToCurrentPage({
    filters: currentFilters,          // main-фільтри
    subConditions: phonesSubConditions, // актуальні саб-фільтри
    lastPage,
    hasAnyFiltersFn: hasAnyFilters,
    navigate,
    activeMenu,
    GovUaCurrentPage,
    lotusCurrentPage,
    phonesCurrentPage
  });
}, [phonesSubConditions, currentFilters]);

  // ---------------- HELPERS ----------------
  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) =>
      filterGroups[k]?.includes(key)
    );
    return [...direct, ...reverse];
  };

  const hasAnyFilters = (filters = {}, subConditions = {}) => {
    const hasMain = Object.values(filters).some(Boolean);
    const hasSub = Object.values(subConditions).some(
      (group) => Object.keys(group || {}).length > 0
    );
    debugger;
    return hasMain || hasSub;
  };

  // ---------------- REDIRECT ----------------
  const redirectToCurrentPage = (filters = {}) => {
    redirectUtil({
      filters,
      subConditions: phonesSubConditions,
      lastPage,
      hasAnyFiltersFn: hasAnyFilters,
      navigate,
      activeMenu,
      GovUaCurrentPage,
      lotusCurrentPage,
      phonesCurrentPage
    });
  };

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
    // ✅ Скидання prevChunks та очищення індексів
    prevChunks.current = [];
    if (typeof addIndexesOfFiltredResults === "function") {
      addIndexesOfFiltredResults(activeMenu, []);
    }
  };

  // ---------------- FILTERING & DISPATCH ----------------
  const filteredChunks = useMemo(() => {
    if (!hasAnyFilters(currentFilters, phonesSubConditions)) {
      // ✅ Очистка prevChunks і стору, якщо немає активних фільтрів
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
