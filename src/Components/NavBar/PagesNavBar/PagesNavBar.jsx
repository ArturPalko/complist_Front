import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import {
  selectPaginationPagesCount,
  getCountOfPageForFiltredResults,
  activeMenu,
  isFilterAppliedSelector,
  selectSearchValueByPage,
  isSearchValueFoundByPage,
  isEditModeSelected,
  getCurrentMode,
  getSearchMode,
  selectFoundResultsByPage,
  selectAtiveDepartmentId,
  selectActiveSectionId,
} from "../../../redux/selectors/selector";

import {
  rememberCurrentPagesActionCreator,
  setFilterPage,
  setLastVisitedPage,
} from "../../../redux/reducers/pagesNavbar-reducer";

import {
  togglepagesNavbarLinkElementOnCurrentPage,
} from "../../../redux/reducers/toggledElements-reducer";

import PagesNavBarView from "./PagesNavbarView/PagesNavbarView";

import {
  handleLastVisitedPage,
  handleSearchResults,
  getPageInfoFromPath,
  getPagesCount,
} from "./pageUtils";

import {
  Pages,
  rowsPerPage,
} from "../../../configs/app/constants";

const PagesNavBar = (props) => {
  const location = useLocation();

  const searchMode = useSelector(getSearchMode);
  const editMode = useSelector(isEditModeSelected);

  const activeDepartmentId = useSelector(
    selectAtiveDepartmentId
  );

  const activeSectionId = useSelector(
    selectActiveSectionId
  );

  const isNestedContext =
    activeDepartmentId !== null ||
    activeSectionId !== null;

  const pressTimer = useRef(null);
  const isPressed = useRef(false);

  const lastPageRef = useRef({
    pageName: null,
    pageFromURL: null,
  });

  const delay = 1000;

  const [showFoundResultPage, setShowFoundResultsPage] =
    useState(false);

  const [indexes, setIndexes] = useState([]);

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const {
    pageName,
    basePath,
    pageFromURL,
  } = getPageInfoFromPath(pathParts);

  const isFoundResultsPage =
    pageFromURL === "foundResults";

  const hasSearchResults =
    searchMode === "filter" &&
    props.foundResults?.length > 0;

  const filterPagesCount = Math.ceil(
    (props.foundResults?.length ?? 0) /
      rowsPerPage
  );

  const normalPagesCount = getPagesCount({
    countFiltred: props.countFiltred,
    pagesCount: props.pagesCount,
    activeMenu: props.activeMenu,
    isFilterApplied: props.isFilterApplied,
    pageName,
  });

  const count = hasSearchResults
    ? filterPagesCount
    : normalPagesCount;

  const handleNavLinkPressed = (e) => {
    if (pageFromURL === e.currentTarget.textContent) {
      pressTimer.current = setTimeout(() => {
        props.togglepagesNavbarLinkElementOnCurrentPage(
          true
        );

        isPressed.current = true;
      }, delay);
    }
  };

  const handleNavLinkUnpressed = () => {
    clearTimeout(pressTimer.current);

    if (isPressed.current) {
      props.togglepagesNavbarLinkElementOnCurrentPage(
        false
      );

      isPressed.current = false;
    }
  };

  useEffect(() => {
    if (!pageName || !pageFromURL) return;

    if (
      lastPageRef.current.pageName === pageName &&
      lastPageRef.current.pageFromURL === pageFromURL
    ) {
      return;
    }

    if (!isNestedContext) {
      handleLastVisitedPage({
        pageName,
        pageFromURL,
        isFilterApplied: props.isFilterApplied,
        lastVisitedPage: props.lastVisitedPage,
        currentFilterPage: props.currentFilterPage,
        setLastVisitedPage: props.setLastVisitedPage,
        setFilterPage: props.setFilterPage,
        rememberCurrentPage:
          props.rememberCurrentPage,
        currentMode: props.currentMode,
        searchMode: props.searchMode,
      });
    }

    lastPageRef.current = {
      pageName,
      pageFromURL,
    };
  }, [
    pageName,
    pageFromURL,
    props.searchMode,
    isNestedContext,
  ]);

  useEffect(() => {
    handleSearchResults({
      isSearchValueFound:
        props.isSearchValueFound,
      searchValue: props.searchValue,
      setShowFoundResultsPage,
      setIndexes,
    });
  }, [
    props.isSearchValueFound,
    props.searchValue,
  ]);

  return (
    <PagesNavBarView
      {...props}
      count={count}
      pageFromURL={pageFromURL}
      basePath={basePath}
      showFoundResultPage={
        showFoundResultPage
      }
      setShowFoundResultsPage={
        setShowFoundResultsPage
      }
      indexes={indexes}
      isFoundResultsPage={
        isFoundResultsPage
      }
      handleNavLinkPressed={
        handleNavLinkPressed
      }
      handleNavLinkUnpressed={
        handleNavLinkUnpressed
      }
      editMode={editMode}
      searchMode={props.searchMode}
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);
  const currentMode = getCurrentMode(state);
  const searchMode = getSearchMode(state);

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : menu;

  return {
    currentMode,
    activeMenu: menu,
    searchMode,

    pagesCount:
      selectPaginationPagesCount(
        menu,
        currentMode
      )(state),

    searchValue:
      selectSearchValueByPage(searchKey)(state),

    isSearchValueFound:
      isSearchValueFoundByPage(searchKey)(
        state
      ),

    foundResults:
      selectFoundResultsByPage(searchKey)(
        state
      ),

    countFiltred: (menu) =>
      getCountOfPageForFiltredResults(
        state,
        menu
      ),

    isFilterApplied: (menu) =>
      isFilterAppliedSelector(menu)(state),
  };
};

const mapDispatchToProps = {
  rememberCurrentPage:
    rememberCurrentPagesActionCreator,

  togglepagesNavbarLinkElementOnCurrentPage,

  setFilterPage,

  setLastVisitedPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesNavBar);