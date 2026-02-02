import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  activeMenu,
  isPresentedSearchField,
  getCountOfFoundResults,
  getIndexesOfFiltredResults,
  selectSearchValueByPage,
  isSearchValueFoundByPage,
  getDataForMenu
} from "../../../redux/selectors/selector.js";

import {
  addFoundItems,
  clearSearchForm,
  updateDraftValue
} from "../../../redux//reducers/toggledElements-reducer.js";

import SearchForm from "./SearchForm/SearchForm.jsx";
import { useFilteredPageData } from "../../../redux/hooks/hooks.js";

const Search = (props) => {
  const activeMenuStr = props.activeMenu || "";

  const [showNotFound, setShowNotFound] = useState(false);
  const [userSearchedOnce, setUserSearchedOnce] = useState(false);
  const [lastSearchFound, setLastSearchFound] = useState(true);

  const inputRef = useRef(null);

  const draftValue = props.draftValue(activeMenuStr);
  const searchValue = props.searchFieldValue(activeMenuStr);

  const inputValue =
    showNotFound ? "Не знайдено" : draftValue || searchValue || "";

  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNotFound, activeMenuStr]);

  // ✅ ДАНІ ДЛЯ ПОШУКУ (універсальний селектор)
  const searchArea = props.dataForMenu;

  const { data: filteredPageData, isFilterApplied } =
    useFilteredPageData(searchArea);

  const runSearch = () => {
    const searchValueTrimmed = draftValue.trim();
    if (searchValueTrimmed.length < 3) return;

    const searchTarget = isFilterApplied
      ? filteredPageData
      : searchArea;

    const excludedKeys = [
      "type",
      "userId",
      "userTypeId",
      "userTypePriority",
      "userPositionPriority",
      "departmentId",
      "departmentPriority",
      "sectionId",
      "sectionPriority"
    ];

    const foundResults = [];

    searchTarget.forEach(page => {
      if (!page?.rows) return;

      page.rows.forEach((row, rowIndex) => {
        if (!row) return;

        const index = rowIndex + 1;
        let foundInRow = false;

        for (const [key, value] of Object.entries(row)) {
          if (
            !excludedKeys.includes(key) &&
            typeof value === "string" &&
            value.toLowerCase().includes(searchValueTrimmed.toLowerCase())
          ) {
            foundResults.push({
              elementType: row.type,
              dataKey: key,
              dataValue: value,
              currentPage: page.pageIndex,
              index
            });
            foundInRow = true;
            break;
          }
        }

        if (!foundInRow && Array.isArray(row.phones)) {
          row.phones.forEach(phone => {
            if (
              phone?.phoneName
                ?.toLowerCase()
                .includes(searchValueTrimmed.toLowerCase())
            ) {
              foundResults.push({
                elementType: row.type,
                dataKey: "phoneName",
                dataValue: phone.phoneName,
                currentPage: page.pageIndex,
                index
              });
            }
          });
        }
      });
    });

    if (!foundResults.length) {
      setShowNotFound(true);
      setTimeout(() => setShowNotFound(false), 1000);
      setLastSearchFound(false);
    } else {
      setLastSearchFound(true);
    }

    props.addFoundItems(activeMenuStr, searchValueTrimmed, foundResults);
  };

  const handleOnSearchButtonClick = (e) => {
    e.preventDefault();
    runSearch();
    setUserSearchedOnce(true);
  };

  const handleOnClearSearchFormButtonClick = () => {
    props.clearSearchForm(activeMenuStr);
  };

  useEffect(() => {
    if (!userSearchedOnce) return;
    if (!lastSearchFound) return;
    runSearch();
  }, [props.getIndexesOfFiltredResults]);

  return (
    <SearchForm
      ref={inputRef}
      showNotFound={showNotFound}
      inputValue={inputValue}
      setInputValue={(value) =>
        value !== ""
          ? props.updateDraftValue(activeMenuStr, value)
          : props.clearSearchForm(activeMenuStr)
      }
      isPresentedSearchField={props.isPresentedSearchField}
      handleOnSearchButtonClick={handleOnSearchButtonClick}
      handleOnClearSearchFormButtonClick={handleOnClearSearchFormButtonClick}
      getCountOfFoundResults={() =>
        props.getCountOfFoundResults(activeMenuStr)
      }
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);

  return {
    activeMenu: menu,
    isPresentedSearchField: isPresentedSearchField(state),

    // ✅ універсальний селектор
    dataForMenu: getDataForMenu(state, menu),

    searchFieldValue: (m) =>
      state.toggledElements.searchField[m]?.searchValue || "",
    draftValue: (m) =>
      state.toggledElements.searchField[m]?.draftValue || "",

    getCountOfFoundResults: (m) =>
      getCountOfFoundResults(state, m),

    getIndexesOfFiltredResults:
      getIndexesOfFiltredResults(state, menu),

    isGovUaSearchValueFounded:
      isSearchValueFoundByPage("Gov-ua")(state),
    isLotusSearchValueFounded:
      isSearchValueFoundByPage("Lotus")(state),
    isPhonesSearchValueFound:
      isSearchValueFoundByPage("phones")(state),
  };
};

const mapDispatchToProps = {
  addFoundItems,
  clearSearchForm,
  updateDraftValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
