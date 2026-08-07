import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";

import {
  activeMenu,
  isPresentedSearchField,
  getCountOfFoundResults,
  getDataForMenu,
  getIndexesOfFiltredResults,
  selectSearchStateByMenu,
} from "../../../redux/selectors/selector.js";

import {
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
} from "../../../redux/reducers/toggledElements-reducer.js";

import SearchForm from "./SearchForm/SearchForm.jsx";
import { useFilteredPageData } from "../../../redux/hooks/hooks.js";
import { runSearch } from "./searchUtils.js";

const Search = ({
  activeMenu: activeMenuStr,
  searchState,
  searchSource,
  isPresentedSearchField,
  getCountOfFoundResults,
  getIndexesOfFiltredResults,
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
}) => {
  const inputRef = useRef(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const {
    draftValue,
    searchValue,
    userSearchedOnce,
    lastSearchFound,
  } = searchState;

  const inputValue = showNotFound
    ? "Не знайдено"
    : draftValue || searchValue || "";

  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNotFound, activeMenuStr]);

  const { data: filteredPageData, isFilterApplied } =
    useFilteredPageData(searchSource);

  const executeSearch = () => {
    const target = isFilterApplied
      ? filteredPageData
      : searchSource;

    const results = runSearch({
      searchValue: draftValue,
      searchTarget: target,
    });

    if (!results.length) {
      setShowNotFound(true);
      setTimeout(() => setShowNotFound(false), 1000);
    }

    addFoundItems(activeMenuStr, draftValue.trim(), results);
  };

  useEffect(() => {
    if (!userSearchedOnce || !lastSearchFound) return;

    executeSearch();
  }, [getIndexesOfFiltredResults]);

  return (
    <SearchForm
      ref={inputRef}
      showNotFound={showNotFound}
      inputValue={inputValue}
      setInputValue={(value) =>
        value !== ""
          ? updateDraftValue(activeMenuStr, value)
          : clearSearchForm(activeMenuStr)
      }
      isPresentedSearchField={isPresentedSearchField}
      handleOnSearchButtonClick={(e) => {
        e.preventDefault();
        executeSearch();
      }}
      handleOnClearSearchFormButtonClick={() =>
        clearSearchForm(activeMenuStr)
      }
      getCountOfFoundResults={() =>
        getCountOfFoundResults(activeMenuStr)
      }
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);

  return {
    activeMenu: menu,
    isPresentedSearchField: isPresentedSearchField(state),
    searchSource: getDataForMenu(state, menu),
    searchState: selectSearchStateByMenu(state, menu),
    getCountOfFoundResults: (m) =>
      getCountOfFoundResults(state, m),
    getIndexesOfFiltredResults: getIndexesOfFiltredResults(state, menu),
  };
};

const mapDispatchToProps = {
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);