import { useEffect, useState, useRef } from "react";
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

import { Pages } from "../../../configs/app/constants";

const PagesNavBar = (props) => {
  const location = useLocation();

  const pressTimer = useRef(null);
  const isPressed = useRef(false);

  const delay = 1000;

  const [showFoundResultPage, setShowFoundResultsPage] =
    useState(false);

  const [indexes, setIndexes] = useState([]);

  // Ref для останньої обробленої сторінки
  const lastPageRef = useRef({
    pageName: null,
    pageFromURL: null,
  });

  // =====================================================
  // URL
  // =====================================================

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

  const editMode = useSelector(isEditModeSelected);

  // =====================================================
  // КІЛЬКІСТЬ СТОРІНОК
  // =====================================================

  const count = getPagesCount({
    countFiltred: props.countFiltred,
    pagesCount: props.pagesCount,
    activeMenu: props.activeMenu,
    isFilterApplied: props.isFilterApplied,
    pageName,
  });

  // =====================================================
  // НАТИСКАННЯ НА НОМЕР СТОРІНКИ
  // =====================================================

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

  // =====================================================
  // ОСТАННЯ ВІДВІДАНА СТОРІНКА
  // =====================================================

  useEffect(() => {
    if (!pageName || !pageFromURL) return;

    if (
      lastPageRef.current.pageName === pageName &&
      lastPageRef.current.pageFromURL === pageFromURL
    ) {
      return;
    }

    handleLastVisitedPage({
      pageName,
      pageFromURL,
      isFilterApplied: props.isFilterApplied,
      lastVisitedPage: props.lastVisitedPage,
      currentFilterPage: props.currentFilterPage,
      setLastVisitedPage: props.setLastVisitedPage,
      setFilterPage: props.setFilterPage,
      rememberCurrentPage: props.rememberCurrentPage,
      currentMode: props.currentMode,
    });

    lastPageRef.current = {
      pageName,
      pageFromURL,
    };
  }, [pageName, pageFromURL]);

  // =====================================================
  // ПОШУК
  // =====================================================

  useEffect(() => {
    handleSearchResults({
      isSearchValueFound: props.isSearchValueFound,
      searchValue: props.searchValue,
      setShowFoundResultsPage,
      setIndexes,
    });
  }, [
    props.isSearchValueFound,
    props.searchValue,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <PagesNavBarView
      {...props}
      count={count}
      pageFromURL={pageFromURL}
      basePath={basePath}
      showFoundResultPage={showFoundResultPage}
      setShowFoundResultsPage={setShowFoundResultsPage}
      indexes={indexes}
      isFoundResultsPage={isFoundResultsPage}
      handleNavLinkPressed={handleNavLinkPressed}
      handleNavLinkUnpressed={handleNavLinkUnpressed}
      editMode={editMode}
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
   * ===================================================
   * ВАЖЛИВО
   * ===================================================
   *
   * Звичайні сторінки:
   *
   *   Gov-ua
   *   Lotus
   *   phones
   *
   * використовують власний searchField.
   *
   * Dictionary:
   *
   *   positions
   *   departments
   *   sections
   *   userTypes
   *
   * використовують один:
   *
   *   searchField.dictionary
   */

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : menu;

  console.log(
    "PagesNavBar searchKey:",
    searchKey
  );

  console.log(
    "PagesNavBar currentMode:",
    currentMode
  );

  console.log(
    "PagesNavBar searchValue:",
    selectSearchValueByPage(searchKey)(state)
  );

  console.log(
    "PagesNavBar isSearchValueFound:",
    isSearchValueFoundByPage(searchKey)(state)
  );

  return {
    currentMode,

    activeMenu: menu,

    pagesCount: selectPaginationPagesCount(
      menu,
      currentMode
    )(state),

    /*
     * Тут головна зміна:
     *
     * Dictionary -> dictionary
     * Інші меню -> activeMenu
     */

    searchValue:
      selectSearchValueByPage(searchKey)(state),

    isSearchValueFound:
      isSearchValueFoundByPage(searchKey)(state),

    countFiltred: (menu) =>
      getCountOfPageForFiltredResults(
        state,
        menu
      ),

    isFilterApplied: (menu) =>
      isFilterAppliedSelector(menu)(state),
  };
};

// =====================================================
// DISPATCH
// =====================================================

const mapDispatchToProps = {
  rememberCurrentPage:
    rememberCurrentPagesActionCreator,

  togglepagesNavbarLinkElementOnCurrentPage,

  setFilterPage,

  setLastVisitedPage,
};

// =====================================================
// CONNECT
// =====================================================

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesNavBar);