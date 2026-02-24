import { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { rememberPreviousLocationActionCreator } from "../reducers/pagesNavbar-reducer";
import {getPageIndexDataOfFoundResultsByPage, getCurrentPageNumberByKey,
  isFilterAppliedSelector
 } from "../selectors/selector";
import { activeMenu as activeMenuSelector, getIndexesOfFiltredResults} from "../selectors/selector";
import { createSelector } from '@reduxjs/toolkit';
import { selectIndexesFromCell } from "../selectors/selector";


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



export const useIndexesForPage = (pageKey) => {
  const dispatch = useDispatch();

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
debugger;
  return indexes;
};







export const useFilteredPageData = (mailsData) => {
  const activeMenu = useSelector(activeMenuSelector);

  // мемоізований селектор прямо тут
  const filtredChunks = useSelector(
    createSelector(
      state => state,
      state => activeMenu,
      (state, activeMenu) => getIndexesOfFiltredResults(state, activeMenu)
    )
  );

  const isFilterApplied = useSelector(isFilterAppliedSelector(activeMenu));

  return useMemo(() => {
    if (!Array.isArray(mailsData)) return { data: [], isFilterApplied: false };

    if (isFilterApplied) {
      if (!Array.isArray(filtredChunks) || filtredChunks.length === 0) {
        return { data: [], isFilterApplied: true };
      }

      const mappedChunks = filtredChunks
        .map(chunk => {
          const rows = chunk.rows
            .map(row => {
              const page = mailsData.find(p => p.pageIndex === row.page);
              return page?.rows?.[row.index] ?? null;
            })
            .filter(Boolean);

          return rows.length > 0 ? { pageIndex: chunk.pageIndex, rows } : null;
        })
        .filter(Boolean);

      return { data: mappedChunks, isFilterApplied: true };
    }

    return { data: mailsData, isFilterApplied: false };
  }, [mailsData, filtredChunks, isFilterApplied]);
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