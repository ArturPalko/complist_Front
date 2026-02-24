import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";

import {
  activeMenu,
  isPresentedSearchField,
  getCountOfFoundResults,
  getDataForMenu,
  getIndexesOfFiltredResults,
  selectSearchStateByMenu
} from "../../../redux/selectors/selector.js";

import { addFoundItems, clearSearchForm, updateDraftValue } from "../../../redux/reducers/toggledElements-reducer.js";

import SearchForm from "./SearchForm/SearchForm.jsx";
import { useFilteredPageData } from "../../../redux/hooks/hooks.js";
import { runSearch } from "./searchUtils.js";



const Search = ({
  activeMenu: activeMenuStr,
  searchState,
  dataForMenu,
  isPresentedSearchField,
  getCountOfFoundResults,
  getIndexesOfFiltredResults,
  addFoundItems,
  clearSearchForm,
  updateDraftValue
}) => {
  const inputRef = useRef(null);
  const [showNotFound, setShowNotFound] = useState(false);

  
   const { draftValue, searchValue, userSearchedOnce, lastSearchFound} = searchState;

  const inputValue = showNotFound ? "Не знайдено" : draftValue || searchValue || "";

  // Фокус на input
  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNotFound, activeMenuStr]);

  // Пошук при зміні індексів фільтрованих результатів
  useEffect(() => {
    if (!userSearchedOnce) return;
    if (!lastSearchFound) return;

    executeSearch();
  }, [getIndexesOfFiltredResults]);

  const { data: filteredPageData, isFilterApplied } = useFilteredPageData(dataForMenu);

  const executeSearch = () => {
    const searchTarget = isFilterApplied ? filteredPageData : dataForMenu;
    const results = runSearch({ searchValue: draftValue, searchTarget });

    if (!results.length) {
      setShowNotFound(true);
      setTimeout(() => setShowNotFound(false), 1000);
    }

    addFoundItems(activeMenuStr, draftValue.trim(), results);
  };

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
      handleOnClearSearchFormButtonClick={() => clearSearchForm(activeMenuStr)}
      getCountOfFoundResults={() => getCountOfFoundResults(activeMenuStr)}
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);

  return {
    activeMenu: menu,
    isPresentedSearchField: isPresentedSearchField(state),
    dataForMenu: getDataForMenu(state, menu),
    searchState: selectSearchStateByMenu(state, menu),
    getCountOfFoundResults: (m) => getCountOfFoundResults(state, m),
    getIndexesOfFiltredResults: getIndexesOfFiltredResults(state, menu)
  };
};

const mapDispatchToProps = {
  addFoundItems,
  clearSearchForm,
  updateDraftValue
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);