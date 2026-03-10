import { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { rememberPreviousLocationActionCreator } from "../reducers/pagesNavbar-reducer";
import {getPageIndexDataOfFoundResultsByPage, getCurrentPageNumberByKey} from "../selectors/selector";
import { activeMenu as activeMenuSelector} from "../selectors/selector";
import { createSelector } from '@reduxjs/toolkit';
import { selectIndexesFromCell } from "../selectors/selector";
import { getFilteredPageData } from "../../shared/functions/getDataByIndexes";
import { checkAuth } from "../../dal/thunks/authThunks";

export const usePageNumber = () => {
  const params = useParams();
  return Number(params.pageNumber) || 1;
};


export const useTrackLocation = () => {
  const location = useLocation();
  const prevPathRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (prevPathRef.current && prevPathRef.current !== location.pathname) {
      dispatch(rememberPreviousLocationActionCreator(prevPathRef.current));
    }
    prevPathRef.current = location.pathname;
  }, [location, dispatch]);
};



export const useCheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
};


export const useIndexesForPage = (pageKey) => {

  const indexesFromIndexCell = useSelector(state => selectIndexesFromCell(state));

  const indexesFromPage = useSelector(
    createSelector(
      state => state,
      state => pageKey,
      (state, pageKey) => {
        const pageNumber = getCurrentPageNumberByKey(pageKey)(state);
        const data = getPageIndexDataOfFoundResultsByPage(pageKey)(state) || [];
        return data
          .filter(item => Number(item.currentPage) === Number(pageNumber))
          .map(item => item.index);
      }
    )
  );
const indexes =
  indexesFromIndexCell.length == 1
    ? indexesFromIndexCell // обгортаємо число в масив
    : indexesFromPage;
  return indexes;
};





export const useFilteredPageData = (data) => {
  const state = useSelector(state => state);
  const activeMenu = useSelector(activeMenuSelector);

  return useMemo(
    () => getFilteredPageData(state, data, activeMenu),
    [state, data, activeMenu]
  );
};



export const useFoundResultsColNumbersLogic = ({
  isLastVisitedPageWasFoundResults,
  indexesOfFoundResultsForCurrentPage = [],
  isPagesNavbarLinkPressed,
  isPreviousPageWasFoundResult,
}) => {
  const [showPreviousPageHighlight, setShowPreviousPageHighlight] = useState(false);

  // Клас для анімації колонки
  const showDigitsFromPressed =
    isLastVisitedPageWasFoundResults &&
    indexesOfFoundResultsForCurrentPage.length > 0 &&
    isPagesNavbarLinkPressed
      ? "showColnumbersWhenPagesLinkOnCurrentPagePressed"
      : "";

  // Чи відображати блок colNumbers
  const shouldShowColNumbers =
    indexesOfFoundResultsForCurrentPage.length > 0 &&
    (isPagesNavbarLinkPressed || showPreviousPageHighlight);
  useEffect(() => {
    let timer;
    if (isPreviousPageWasFoundResult) {
      setShowPreviousPageHighlight(true);
      timer = setTimeout(() => setShowPreviousPageHighlight(false), 3000);
    } else {
      setShowPreviousPageHighlight(false);
    }
    return () => clearTimeout(timer);
  }, [isPreviousPageWasFoundResult]);

  return {
    showDigitsFromPressed,
    shouldShowColNumbers,
    showPreviousPageHighlight,
  };
};

