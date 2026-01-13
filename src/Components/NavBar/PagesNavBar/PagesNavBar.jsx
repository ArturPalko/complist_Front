import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { connect } from "react-redux";

import {
  selectPaginationPagesCount,
  getCountOfPageForFiltredResults,
  activeMenu,
  isFilterAppliedSelector,
  selectSearchValueByPage,
  isSearchValueFoundByPage,
} from "../../../redux/selectors/selector";

import {
  rememberCurrentPagesActionCreator,
  setFilterPage,
  setLastVisitedPage,
} from "../../../redux/pagesNavbar-reducer";

import { togglepagesNavbarLinkElementOnCurrentPage } from "../../../redux/toggledElements-reducer";

import PagesNavBarView from "./PagesNavbarView/PagesNavbarView";
import { 
  handleLastVisitedPage, 
  handleSearchResults, 
  getPageInfoFromPath, 
  getPagesCount 
} from "./pageUtils";

/* =========================
   PagesNavBar Component
========================= */

const PagesNavBar = (props) => {
  /* =========================
     state & refs
  ========================== */
  const location = useLocation();
  const pressTimer = useRef(null);
  const isPressed = useRef(false);
  const delay = 1000;

  const [showFoundResultPage, setShowFoundResultsPage] = useState(false);
  const [indexes, setIndexes] = useState([]);

  /* =========================
     path parsing
  ========================== */
  const pathParts = location.pathname.split("/").filter(Boolean);
  const { pageName, basePath, pageFromURL } = getPageInfoFromPath(pathParts);
  const isFoundResultsPage = pageFromURL === "foundResults";

  /* =========================
     pages count
  ========================== */
  const count = getPagesCount({
    countFiltred: props.countFiltred,
    pagesCount: props.pagesCount,
    activeMenu: props.activeMenu,
    isFilterApplied: props.isFilterApplied,
    pageName,
  });

  /* =========================
     mouse handlers
  ========================== */
  const handleNavLinkPressed = (e) => {
    if (pageFromURL === e.currentTarget.textContent) {
      pressTimer.current = setTimeout(() => {
        props.togglepagesNavbarLinkElementOnCurrentPage(true);
        isPressed.current = true;
      }, delay);
    }
  };

  const handleNavLinkUnpressed = () => {
    clearTimeout(pressTimer.current);
    if (isPressed.current) {
      props.togglepagesNavbarLinkElementOnCurrentPage(false);
      isPressed.current = false;
    }
  };

  /* =========================
     remember last page
  ========================== */
  useEffect(() => {
    handleLastVisitedPage({
      pageName,
      pageFromURL,
      isFilterApplied: props.isFilterApplied,
      searchValue: props.searchValue,
      setLastVisitedPage: props.setLastVisitedPage,
      setFilterPage: props.setFilterPage,
      rememberCurrentPage: props.rememberCurrentPage,
    });
  }, [location.pathname, props.searchValue, pageName, pageFromURL]);

  /* =========================
     search logic
  ========================== */
  useEffect(() => {
    handleSearchResults({
      isSearchValueFound: props.isSearchValueFound,
      searchValue: props.searchValue,
      setShowFoundResultsPage,
      setIndexes,
    });
  }, [props.isSearchValueFound, props.searchValue]);

  /* =========================
     render
  ========================== */
  return (
    <PagesNavBarView
      basePath={basePath}
      count={count}
      showFoundResultPage={showFoundResultPage}
      isFoundResultsPage={isFoundResultsPage}
      indexes={indexes}
      handleNavLinkPressed={handleNavLinkPressed}
      handleNavLinkUnpressed={handleNavLinkUnpressed}
    />
  );
};

/* =========================
   redux
========================= */
const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  pagesCount: selectPaginationPagesCount(activeMenu(state))(state),

  searchValue: selectSearchValueByPage(activeMenu(state).toLowerCase())(state),
  isSearchValueFound: isSearchValueFoundByPage(activeMenu(state).toLowerCase())(state),

  countFiltred: (menu) => getCountOfPageForFiltredResults(state, menu),
  isFilterApplied: (menu) => isFilterAppliedSelector(menu)(state),
});

const mapDispatchToProps = {
  rememberCurrentPage: rememberCurrentPagesActionCreator,
  togglepagesNavbarLinkElementOnCurrentPage,
  setFilterPage,
  setLastVisitedPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PagesNavBar);
