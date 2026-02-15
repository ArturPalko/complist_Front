import { redirect, useParams } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { rememberPreviousLocationActionCreator } from "../reducers/pagesNavbar-reducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getPageIndexDataOfFoundResultsByPage, getCurrentPageNumberByKey,
  getFilteredState , isFilterAppliedSelector
 } from "../selectors/selector";
import redArrow from "../../../src/assets/red_arrow.png";
import { DataLoaderContext } from "../hocs/withDataLoader";
import { FoundResultsContext } from "../../Components/FoundResults/FoundResults";
import { useMemo } from "react";
import { SearchToggleContext, PasswordsToggleContext } from "../hocs/withToggleElements";

import { activeMenu as activeMenuSelector, getIndexesOfFiltredResults, getGovUaMails, getLotusMails } from "../selectors/selector";
import { createSelector } from '@reduxjs/toolkit';


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
  const pageNumber = useSelector(
    createSelector(
      state => state,
      state => pageKey,
      (state, pageKey) => getCurrentPageNumberByKey(pageKey)(state)
    )
  );

  const data = useSelector(
    createSelector(
      state => state,
      state => pageKey,
      (state, pageKey) => getPageIndexDataOfFoundResultsByPage(pageKey)(state) || []
    )
  );

  const indexes = data
    .filter(item => Number(item.currentPage) === Number(pageNumber))
    .map(item => item.index);

  return indexes;
};

export const useDataLoader = () => useContext(DataLoaderContext);
// export const useToggleElements = () => useContext(ToggleElementsContext);
export const useFoundResults = () => {
  const context = useContext(FoundResultsContext);
  return context ?? { foundResults: null, indexDataOfFoundResultsForFoundResultsPage: null };
};

// для чекбокса пошуку
export const useSearchToggle = () => useContext(SearchToggleContext);

// для показу паролів
export const usePasswordsToggle = () => useContext(PasswordsToggleContext);








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

