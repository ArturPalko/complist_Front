import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  activeMenu,
  isPresentedSearchField,
  getCountOfFoundResults,
  getDataForMenu,
  getIndexesOfFiltredResults,
  selectSearchStateByMenu,
  getCurrentMode,
  getSearchMode,
} from "../../../redux/selectors/selector.js";

import {
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
} from "../../../redux/reducers/toggledElements-reducer.js";

import SearchForm from "./SearchForm/SearchForm.jsx";
import { useFilteredPageData } from "../../../redux/hooks/hooks.js";
import { runSearch } from "./searchUtils.js";
import { Pages } from "../../../configs/app/constants.js";
import { clearDictionarySearchResults } from "./searchUtils.js";
import { setSearchMode } from "../../../redux/reducers/ui-reducer.js";
import { redirectToCurrentPage } from "../../../redux/hooks/useFilters/useFiltersFunctions/redirectToCurrentPage.js";

const Search = ({
  activeMenu: activeMenuStr,
  currentMode,
  searchState,
  searchSource,
  isPresentedSearchField,
  getCountOfFoundResults,
  getIndexesOfFiltredResults,
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
  searchMode,
  setSearchMode
}) => {
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : activeMenuStr;

  const {
    draftValue,
    searchValue,
  } = searchState;

  const inputValue = showNotFound
    ? "Не знайдено"
    : draftValue || searchValue || "";

  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [
    showNotFound,
    activeMenuStr,
    currentMode,
  ]);

  const {
    data: filteredPageData,
    isFilterApplied,
  } = useFilteredPageData(searchSource);

  const executeSearch = () => {
    const target = isFilterApplied
      ? filteredPageData
      : searchSource;

    const results = runSearch({
      searchValue: draftValue,
      searchTarget: target,
      currentMode
    });

    if (!results.length) {
      setShowNotFound(true);

      setTimeout(() => {
        setShowNotFound(false);
      }, 1000);
    }

    addFoundItems(
      searchKey,
      draftValue.trim(),
      results
    );
  };

  const previousModeRef = useRef(currentMode);

  useEffect(() => {
    clearDictionarySearchResults(
      currentMode,
      previousModeRef,
      clearSearchForm
    );
  }, [currentMode, clearSearchForm]);

const handleSearchModeChange = (mode) => {
  setSearchMode(mode);

  if (mode === "filter") {
    redirectToCurrentPage({
      navigate,
      activeMenu: activeMenuStr,
      viewMode: currentMode,
      currentPage: 1,
    });
  }
};

  return (
    <SearchForm
      ref={inputRef}

      showNotFound={showNotFound}

      inputValue={inputValue}

      searchMode={searchMode}

      onSearchModeChange={handleSearchModeChange}

      setInputValue={(value) =>
        value !== ""
          ? updateDraftValue(searchKey, value)
          : clearSearchForm(searchKey)
      }

      isPresentedSearchField={
        isPresentedSearchField
      }

      handleOnSearchButtonClick={(e) => {
        e.preventDefault();
        executeSearch();
      }}

      handleOnClearSearchFormButtonClick={() =>
        clearSearchForm(searchKey)
      }

      getCountOfFoundResults={() =>
        getCountOfFoundResults(searchKey)
      }
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);
  const currentMode = getCurrentMode(state);

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : menu;

  return {
    activeMenu: menu,

    currentMode,

    isPresentedSearchField:
      isPresentedSearchField(state),

    searchMode: getSearchMode(state),

    searchSource:
      getDataForMenu(state, menu),

    searchState:
      selectSearchStateByMenu(
        state,
        searchKey
      ),

    getCountOfFoundResults: (m) =>
      getCountOfFoundResults(state, m),

    getIndexesOfFiltredResults:
      getIndexesOfFiltredResults(
        state,
        searchKey
      ),
  };
};

const mapDispatchToProps = {
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
  setSearchMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);