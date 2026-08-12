import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";

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
  const inputRef = useRef(null);
  const [showNotFound, setShowNotFound] = useState(false);

  /*
   * =====================================================
   * КЛЮЧ SEARCH STATE
   * =====================================================
   *
   * Звичайні меню:
   *   Gov-ua
   *   Lotus
   *   phones
   *
   * Dictionary:
   *   positions
   *   departments
   *   sections
   *   userTypes
   *
   * Для всіх Dictionary mode використовуємо:
   *
   *   searchField.dictionary
   */

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

  /*
   * =====================================================
   * FOCUS SEARCH INPUT
   * =====================================================
   */

  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [
    showNotFound,
    activeMenuStr,
    currentMode,
  ]);

  /*
   * =====================================================
   * FILTERED DATA
   * =====================================================
   */

  const {
    data: filteredPageData,
    isFilterApplied,
  } = useFilteredPageData(searchSource);

  /*
   * =====================================================
   * EXECUTE SEARCH
   * =====================================================
   */

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

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */
const previousModeRef = useRef(currentMode);

useEffect(() => {
  clearDictionarySearchResults(
    currentMode,
    previousModeRef,
    clearSearchForm
  );
}, [currentMode, clearSearchForm]);

  return (
    <SearchForm
      ref={inputRef}

      showNotFound={showNotFound}

      inputValue={inputValue}

      searchMode= {searchMode}
      
      onSearchModeChange={(mode) => setSearchMode(mode)}
      
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


// =====================================================
// REDUX
// =====================================================

const mapStateToProps = (state) => {
  const menu = activeMenu(state);
  const currentMode = getCurrentMode(state);

  /*
   * Якщо відкритий будь-який Dictionary mode,
   * search state буде:
   *
   *   searchField.dictionary
   *
   * Інакше:
   *
   *   searchField[activeMenu]
   */

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : menu;


  return {
    activeMenu: menu,

    currentMode,

    isPresentedSearchField:
      isPresentedSearchField(state),

    searchMode:getSearchMode(state),
    /*
     * Дані, по яких фактично виконується пошук.
     *
     * Тут залишається menu,
     * тому що getDataForMenu сам визначає
     * потрібні дані залежно від currentMode.
     */
    searchSource:
      getDataForMenu(state, menu),

    /*
     * СТАН ПОШУКУ.
     *
     * Dictionary -> dictionary
     * Gov-ua     -> Gov-ua
     * Lotus      -> Lotus
     * phones     -> phones
     */
    searchState:
      selectSearchStateByMenu(
        state,
        searchKey
      ),

    getCountOfFoundResults: (m) =>
      getCountOfFoundResults(state, m),

    /*
     * Тут також використовуємо searchKey,
     * щоб Dictionary не брав індекси
     * з Gov-ua / Lotus / phones.
     */
    getIndexesOfFiltredResults:
      getIndexesOfFiltredResults(
        state,
        searchKey
      ),
      
  };
};


// =====================================================
// DISPATCH
// =====================================================

const mapDispatchToProps = {
  addFoundItems,
  clearSearchForm,
  updateDraftValue,
  setSearchMode
};


// =====================================================
// CONNECT
// =====================================================

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);