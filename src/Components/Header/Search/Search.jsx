import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  activeMenu,
  isPresentedSearchField,
  getGovUaMails,
  getLotusMails,
  getPhones,
  getCountOfFoundResults,
  getIndexesOfFiltredResults,
  selectSearchValueByPage,
  isSearchValueFoundByPage
} from "../../../redux/selectors/selector.js";
import { addFoundItems, clearSearchForm, updateDraftValue } from "../../../redux/toggledElements-reducer";
import SearchForm from "./SearchForm/SearchForm.jsx";
import { useFilteredPageData } from "../../../redux/hooks/hooks.js";

const Search = (props) => {
  const activeMenuStr = props.activeMenu ? props.activeMenu.toLowerCase() : "";
  const [showNotFound, setShowNotFound] = useState(false);
  const [userSearchedOnce, setUserSearchedOnce] = useState(false);
  const [lastSearchFound, setLastSearchFound] = useState(true);
  const inputRef = useRef(null);

  const draftValue = props.draftValue(activeMenuStr);
  const searchValue = props.searchFieldValue(activeMenuStr);
  const inputValue = showNotFound ? "Не знайдено" : draftValue || searchValue || "";

  useEffect(() => {
    if (!showNotFound && inputRef.current) inputRef.current.focus();
  }, [showNotFound, activeMenuStr]);

  const searchArea = (() => {
    switch (activeMenuStr) {
      case "gov-ua": return props.getGovUaMails;
      case "lotus": return props.getLotusMails;
      case "phones": return props.getPhones;
      default: return [];
    }
  })();

  const { data: filteredPageData, isFilterApplied } = useFilteredPageData(searchArea);

  const runSearch = () => {
    const searchValueTrimmed = draftValue.trim();
    if (searchValueTrimmed.length < 3) return;

    const searchTarget = isFilterApplied ? filteredPageData : searchArea;

    const excludedKeys = [
      "type", "userId", "userTypeId", "userTypePriority",
      "userPositionPriority", "departmentId", "departmentPriority",
      "sectionId", "sectionPriority"
    ];

    const foundResults = [];

    searchTarget.forEach(element => {
      if (!element?.rows) return;

      element.rows.forEach((rowElement, rowIndex) => {
        if (!rowElement) return;
        const index = rowIndex + 1;
        let foundInRow = false;

        for (const [key, value] of Object.entries(rowElement)) {
          if (!excludedKeys.includes(key) && typeof value === "string" && value.toLowerCase().includes(searchValueTrimmed.toLowerCase())) {
            foundResults.push({ elementType: rowElement.type, dataKey: key, dataValue: value, currentPage: element.pageIndex, index });
            foundInRow = true;
            break;
          }
        }

        if (!foundInRow && Array.isArray(rowElement.phones)) {
          rowElement.phones.forEach(phone => {
            if (phone?.phoneName?.toLowerCase().includes(searchValueTrimmed.toLowerCase())) {
              foundResults.push({ elementType: rowElement.type, dataKey: "phoneName", dataValue: phone.phoneName, currentPage: element.pageIndex, index });
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
        value !== "" ? props.updateDraftValue(activeMenuStr, value) : props.clearSearchForm(activeMenuStr)
      }
      isPresentedSearchField={props.isPresentedSearchField}
      handleOnSearchButtonClick={handleOnSearchButtonClick}
      handleOnClearSearchFormButtonClick={handleOnClearSearchFormButtonClick}
      getCountOfFoundResults={() => props.getCountOfFoundResults(activeMenuStr)}
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);

  return {
    activeMenu: menu,
    isPresentedSearchField: isPresentedSearchField(state),
    getGovUaMails: getGovUaMails(state),
    getLotusMails: getLotusMails(state),
    getPhones: getPhones(state),
    searchFieldValue: (m) => state.toggledElements.searchField[m]?.searchValue || "",
    draftValue: (m) => state.toggledElements.searchField[m]?.draftValue || "",
    getCountOfFoundResults: (m) => getCountOfFoundResults(state, m),
    getIndexesOfFiltredResults: getIndexesOfFiltredResults(state, menu),
    // старі селектори замінені на універсальний
    isGovUaSearchValueFounded: isSearchValueFoundByPage("gov-ua")(state),
    isLotusSearchValueFounded: isSearchValueFoundByPage("lotus")(state),
    isPhonesSearchValueFound: isSearchValueFoundByPage("phones")(state)
  };
};

const mapDispatchToProps = { addFoundItems, clearSearchForm, updateDraftValue };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
