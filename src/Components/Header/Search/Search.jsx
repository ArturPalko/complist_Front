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

    console.log("========== SEARCH ==========");
    console.log("activeMenu:", activeMenuStr);
    console.log("currentMode:", currentMode);
    console.log("searchKey:", searchKey);
    console.log("draftValue:", draftValue);
    console.log("searchSource:", searchSource);
    console.log("results:", results);
    console.log("============================");

    if (!results.length) {
      setShowNotFound(true);

      setTimeout(() => {
        setShowNotFound(false);
      }, 1000);
    }

    /*
     * ГОЛОВНА ЗМІНА
     *
     * Dictionary:
     *
     *   addFoundItems("dictionary", ...)
     *
     * Звичайні меню:
     *
     *   addFoundItems("Gov-ua", ...)
     *   addFoundItems("Lotus", ...)
     *   addFoundItems("phones", ...)
     */

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

  return (
    <SearchForm
      ref={inputRef}

      showNotFound={showNotFound}

      inputValue={inputValue}

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

  console.log("========== SEARCH REDUX ==========");
  console.log("activeMenu:", menu);
  console.log("currentMode:", currentMode);
  console.log("searchKey:", searchKey);
  console.log("==================================");

  return {
    activeMenu: menu,

    currentMode,

    isPresentedSearchField:
      isPresentedSearchField(state),

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
};


// =====================================================
// CONNECT
// =====================================================

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);