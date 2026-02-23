import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";

import {
  activeMenu,
  isPresentedSearchField,
  getCountOfFoundResults,
  getIndexesOfFiltredResults,
  getDataForMenu
} from "../../../redux/selectors/selector.js";

import {
  addFoundItems,
  clearSearchForm,
  updateDraftValue
} from "../../../redux/reducers/toggledElements-reducer.js";

import SearchForm from "./SearchForm/SearchForm.jsx";
import { useFilteredPageData } from "../../../redux/hooks/hooks.js";

import { runSearch } from "./searchUtils.js";


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
    setUserSearchedOnce(true)
  }, [ activeMenuStr]);

  useEffect(() => {
    if (!showNotFound && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNotFound, activeMenuStr]);

  
  useEffect(() => {

    if (!userSearchedOnce) return;

    if (!lastSearchFound) return;
    debugger;
    executeSearch();

  }, [props.getIndexesOfFiltredResults]);


  const searchArea = props.dataForMenu;

  const { data: filteredPageData, isFilterApplied } =
    useFilteredPageData(searchArea);



  const executeSearch = () => {

    const searchTarget = isFilterApplied
      ? filteredPageData
      : searchArea;

    const foundResults = runSearch({
      searchValue: draftValue,
      searchTarget
    });


    if (!foundResults.length) {
debugger
      setShowNotFound(true);

      setTimeout(() => setShowNotFound(false), 1000);

      setLastSearchFound(false);

    } else {

      setLastSearchFound(true);

    }


    props.addFoundItems(
      activeMenuStr,
      draftValue.trim(),
      foundResults
    );
  };



  const handleOnSearchButtonClick = (e) => {

    e.preventDefault();

    executeSearch();

    setUserSearchedOnce(true);

  };



  const handleOnClearSearchFormButtonClick = () => {

    props.clearSearchForm(activeMenuStr);

  };



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

    dataForMenu: getDataForMenu(state, menu),

    searchFieldValue: (m) =>
      state.toggledElements.searchField[m]?.searchValue || "",

    draftValue: (m) =>
      state.toggledElements.searchField[m]?.draftValue || "",

    getCountOfFoundResults: (m) =>
      getCountOfFoundResults(state, m),

    getIndexesOfFiltredResults:
      getIndexesOfFiltredResults(state, menu),

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
