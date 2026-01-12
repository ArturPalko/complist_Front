import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setFilterPage, 
    setLastVisitedPage, 
    rememberCurrentPagesActionCreator
     } from  "../../redux/pagesNavbar-reducer";
import {togglepagesNavbarLinkElementOnCurrentPage} from "../toggledElements-reducer.js"
import { parseLocation } from "../hooks/usePageNavbarFunctions/parseLocation";
import { getFoundResults } from "../hooks/usePageNavbarFunctions/getFoundResults";
import { getCountAndIsApplied } from "../hooks/usePageNavbarFunctions/getCountAndIsApplied";
import {usePagesNavBarSelectors} from "./usePageNavbarFunctions/usePagesNavbarSelectors.js"
import { toggledElemetsReducer } from "../toggledElements-reducer.js";
import { resolveFoundResultsState } from "./usePageNavbarFunctions/resolveFoundResultsState.js";
import { resolveVisitedPageUpdate } from "./usePageNavbarFunctions/resolveVisitedPageUpdate.js";
import { usePageContext } from "./usePageNavbarFunctions/usePageContext.js";

export const usePagesNavBarLogic = (delay = 1000) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPageRef = useRef(null);
  const pressTimer = useRef(null);
  const isPressed = useRef(false);
  const keysToKeep = ["currentPage"];

  const [showFoundResultsPage, setShowFoundResultsPage] = useState(false);
  const [indexes, setIndexes] = useState([]);

  // --- Redux state через окремий хук
  const {
    active,
    pagesCount,
    isPhonesFound,
    isLotusFound,
    isGovUaFound,
    foundPhones,
    foundLotus,
    foundGovUa,
    isFilterApplied,
    countFiltred
  } = usePagesNavBarSelectors();


const {
  pageName,
  basePath,
  pageFromURL,
  isFoundResultsPage,
  foundResults,
  count: filteredCount,
  isApplied
} = usePageContext({
  pathname: location.pathname,
  foundPhones,
  foundLotus,
  foundGovUa,
  countFiltred,
  pagesCount,
  isFilterApplied
});

  // --- NavLink хендлери
  const handleNavLinkPressed = () => {
    pressTimer.current = setTimeout(() => {
      dispatch(togglepagesNavbarLinkElementOnCurrentPage(true));
      isPressed.current = true;
    }, delay);
  };

  const handleNavLinkUnpressed = () => {
    clearTimeout(pressTimer.current);
    if (isPressed.current) {
      dispatch(togglepagesNavbarLinkElementOnCurrentPage(false));
      isPressed.current = false;
    }
  };

  const handleNavLinkLeave = () => {
    clearTimeout(pressTimer.current);
    dispatch(togglepagesNavbarLinkElementOnCurrentPage(false));
    isPressed.current = false;
  };

  // --- Effect для оновлення останніх відвіданих сторінок
  useEffect(() => {
  if (!pageName || !pageFromURL) return;
  if (previousPageRef.current === pageFromURL) return;

  previousPageRef.current = pageFromURL;

  resolveVisitedPageUpdate({
    pageName,
    pageFromURL,
    isApplied,
    foundResultsLength: foundResults.length,
    dispatch,
    actions: {
      setLastVisitedPage,
      setFilterPage,
      rememberCurrentPage: rememberCurrentPagesActionCreator
    }
  });
}, [pageName, pageFromURL, isApplied, foundResults.length, dispatch]);


  // --- Effect для обробки пошуку
useEffect(() => {
  const { showFoundResultsPage, indexes } = resolveFoundResultsState({
    active,
    isPhonesFound,
    isLotusFound,
    isGovUaFound,
    foundResults,
    keysToKeep
  });

  setShowFoundResultsPage(showFoundResultsPage);
  setIndexes(indexes);
}, [
  active,
  isPhonesFound,
  isLotusFound,
  isGovUaFound,
  foundResults.length
]);
  return {
    pageName,
    basePath,
    pageFromURL,
    isFoundResultsPage,
    showFoundResultsPage,
    indexes,
    count: filteredCount,
    handleNavLinkPressed,
    handleNavLinkUnpressed,
    handleNavLinkLeave
  };
};
