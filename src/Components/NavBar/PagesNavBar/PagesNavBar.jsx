import  { useEffect, useState, useRef } from "react";
import {useLocation } from "react-router-dom";
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
} from "../../../redux/reducers/pagesNavbar-reducer";

import { togglepagesNavbarLinkElementOnCurrentPage } from "../../../redux/reducers/toggledElements-reducer";

import PagesNavBarView from "./PagesNavbarView/PagesNavbarView";
import { handleLastVisitedPage, handleSearchResults, getPageInfoFromPath, getPagesCount } from "./pageUtils";

const PagesNavBar = (props) => {
  const location = useLocation();
  const pressTimer = useRef(null);
  const isPressed = useRef(false);
  const delay = 1000;

  const [showFoundResultPage, setShowFoundResultsPage] = useState(false);
  const [indexes, setIndexes] = useState([]);

  // --- Ref для останньої обробленої сторінки
  const lastPageRef = useRef({ pageName: null, pageFromURL: null });

  // --- Витягуємо pageName, basePath, pageFromURL
  const pathParts = location.pathname.split("/").filter(Boolean);
  const { pageName, basePath, pageFromURL } = getPageInfoFromPath(pathParts);
  const isFoundResultsPage = pageFromURL === "foundResults";

  // --- Кількість сторінок
  const count = getPagesCount({
    countFiltred: props.countFiltred,
    pagesCount: props.pagesCount,
    activeMenu: props.activeMenu,
    isFilterApplied: props.isFilterApplied,
    pageName,
  });

  // --- Обробники натискання на NavLink
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

  // --- Effect для оновлення останньої відвіданої сторінки
  useEffect(() => {
    if (!pageName || !pageFromURL) return;

    // Якщо ця сторінка вже оброблена, нічого не робимо
    if (
      lastPageRef.current.pageName === pageName &&
      lastPageRef.current.pageFromURL === pageFromURL
    ) return;

    handleLastVisitedPage({
      pageName,
      pageFromURL,
      isFilterApplied: props.isFilterApplied,
      lastVisitedPage: props.lastVisitedPage,
      currentFilterPage: props.currentFilterPage,
      setLastVisitedPage: props.setLastVisitedPage,
      setFilterPage: props.setFilterPage,
      rememberCurrentPage: props.rememberCurrentPage,
    });

    lastPageRef.current = { pageName, pageFromURL };
  }, [pageName, pageFromURL]);

  // --- Effect для обробки пошуку
  useEffect(() => {
    handleSearchResults({
      isSearchValueFound: props.isSearchValueFound,
      searchValue: props.searchValue,
      setShowFoundResultsPage,
      setIndexes,
    });
  }, [props.isSearchValueFound, props.searchValue]);

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

// --- Redux
const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  pagesCount: selectPaginationPagesCount(activeMenu(state))(state),

  searchValue: selectSearchValueByPage(activeMenu(state))(state),
  isSearchValueFound: isSearchValueFoundByPage(activeMenu(state))(state),

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
