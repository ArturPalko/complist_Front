// src/redux/hooks/useFilters.js
import { useState, useEffect, useRef, useCallback } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { redirectToPage } from "../../Components/NavBar/commonFunctions";
import { addFilter } from "../selectors/filterData-reducer";
import { getLastVisitedPage } from "../selectors/selector";
import { useSelector } from "react-redux";
import { filterGroups, conditions, filterPoints } from "./useFiltersFunctions/filtersLogics";
import { computeFilteredChunks } from "./useFiltersFunctions/computeFilteredChunks";
import { redirectToCurrentPage as redirectUtil } from "./useFiltersFunctions/redirectToCurrentPage";
import { handleOnCheckboxChangeHandler } from "./useFiltersFunctions/handlers/handleOnCheckboxChange.js";
import { handleOnClearFormButtonClickHandler } from "./useFiltersFunctions/handlers/handleOnClearFormButtonClick.js";

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

  const [filteredChunks, setFilteredChunks] = useState([]);
  const [lotusFilters, setLotusFilters] = useState({});
  const [govUaFilters, setGovUaFilters] = useState({});
  const [phonesFilters, setPhonesFilters] = useState({});
  const [phonesSubConditions, setPhonesSubConditions] = useState({});

  const lastPage = useSelector(state => getLastVisitedPage(state, activeMenu));

  const filterPointsForCurrentMenu = (filterPoints || []).filter((p) =>
    p.pages.includes((activeMenu || "").toLowerCase())
  );

  const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = [];
    acc[item.groupName].push(item);
    return acc;
  }, {});

  const currentFilters =
    activeMenu === "Lotus" ? lotusFilters :
    activeMenu === "Gov-ua" ? govUaFilters :
    phonesFilters;

  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) => filterGroups[k].includes(key));
    return [...direct, ...reverse];
  };

  const hasAnyFilters = (filters = {}, subConditions = {}) => {
    const hasMain = Object.values(filters || {}).some(Boolean);
    const hasSub = Object.values(subConditions || {}).some(
      group => Object.keys(group || {}).length > 0
    );
    return hasMain || hasSub;
  };

  // Wrapper для хендлерів


const redirectToCurrentPage = (filters = {}, subConditions = phonesSubConditions) => {
  redirectUtil({
    filters,
    subConditions,
    lastPage: lastPage, // беремо з useSelector
    hasAnyFiltersFn: hasAnyFilters,
    navigate,
    activeMenu,
    GovUaCurrentPage,
    lotusCurrentPage,
    phonesCurrentPage
  });
};


  const handleCheckboxChange = (key) =>
    handleOnCheckboxChangeHandler({
      key,
      activeMenu,
      lotusFilters,
      setLotusFilters,
      govUaFilters,
      setGovUaFilters,
      phonesFilters,
      setPhonesFilters,
      phonesSubConditions,
      addFilter,
      redirectToCurrentPage
    });

  const handleOnClearFormButtonClick = () =>
    handleOnClearFormButtonClickHandler({
      activeMenu,
      setLotusFilters,
      setGovUaFilters,
      setPhonesFilters,
      setPhonesSubConditions,
      clearCurrentForm,
      redirectToCurrentPage
    });

  // --- useEffect для перерахунку chunks, синхронізації субфільтрів та скидання фільтрів залишаються без змін ---

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
