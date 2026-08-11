import { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

import { rememberPreviousLocationActionCreator } from "../reducers/pagesNavbar-reducer";

import {
  getPageIndexDataOfFoundResultsByPage,
  getCurrentPageNumberByKey,
  activeMenu as activeMenuSelector,
  selectIndexesFromCell,
  getCurrentMode,
} from "../selectors/selector";

import { getFilteredPageData } from "../../shared/functions/getDataByIndexes";
import { checkAuth } from "../../dal/thunks/authThunks";


// =====================================================
// PAGE NUMBER
// =====================================================

export const usePageNumber = () => {
  const params = useParams();

  return Number(params.pageNumber) || 1;
};


// =====================================================
// TRACK LOCATION
// =====================================================

export const useTrackLocation = () => {
  const location = useLocation();
  const prevPathRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      prevPathRef.current &&
      prevPathRef.current !== location.pathname
    ) {
      dispatch(
        rememberPreviousLocationActionCreator(
          prevPathRef.current
        )
      );
    }

    prevPathRef.current = location.pathname;
  }, [location, dispatch]);
};


// =====================================================
// AUTH
// =====================================================

export const useCheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
};


// =====================================================
// INDEXES FOR CURRENT PAGE
// =====================================================

export const useIndexesForPage = (pageKey) => {
  const currentMode = useSelector(getCurrentMode);

  const indexesFromIndexCell = useSelector(
    (state) => selectIndexesFromCell(state)
  );

  const indexesFromPage = useSelector(
    createSelector(
      (state) => state,
      (state) => {
        // -------------------------------------------------
        // Для dictionary сторінка зберігається:
        //
        // state.currentPageNumber.dictionary[currentMode]
        //
        // Для інших меню:
        //
        // state.currentPageNumber[pageKey]
        // -------------------------------------------------

        const pageNumber =
          pageKey === "dictionary" && currentMode
            ? state.currentPageNumber
                ?.dictionary
                ?. [currentMode]
                ?.lastVisitedPage ?? 1
            : getCurrentPageNumberByKey(pageKey)(state);

        const data =
          getPageIndexDataOfFoundResultsByPage(pageKey)(state) || [];

        console.log(
          "========== useIndexesForPage =========="
        );

        console.log("1️⃣ pageKey:", pageKey);

        console.log("2️⃣ currentMode:", currentMode);

        console.log("3️⃣ pageNumber:", pageNumber);

        console.log("4️⃣ pageIndexData:", data);

        const indexes = data
          .filter(
            (item) =>
              Number(item.currentPage) ===
              Number(pageNumber)
          )
          .map((item) => item.index);

        console.log(
          "5️⃣ indexesFromPage:",
          indexes
        );

        return indexes;
      }
    )
  );

  console.log(
    "6️⃣ indexesFromIndexCell:",
    indexesFromIndexCell
  );

  // Якщо IndexCell вже передав індекси —
  // використовуємо їх.
  //
  // Якщо ні — беремо індекси з foundResults
  // для поточної сторінки.

  const indexes =
    indexesFromIndexCell.length > 0
      ? indexesFromIndexCell
      : indexesFromPage;

  console.log(
    "7️⃣ FINAL indexes:",
    indexes
  );

  return indexes;
};


// =====================================================
// FILTERED PAGE DATA
// =====================================================

export const useFilteredPageData = (data) => {
  const state = useSelector((state) => state);
  const activeMenu = useSelector(activeMenuSelector);

  return useMemo(
    () =>
      getFilteredPageData(
        state,
        data,
        activeMenu
      ),
    [state, data, activeMenu]
  );
};


// =====================================================
// FOUND RESULTS COLUMN NUMBERS
// =====================================================

export const useFoundResultsColNumbersLogic = ({
  isLastVisitedPageWasFoundResults,
  indexesOfFoundResultsForCurrentPage = [],
  isPagesNavbarLinkPressed,
  isPreviousPageWasFoundResult,
}) => {
  const [
    showPreviousPageHighlight,
    setShowPreviousPageHighlight,
  ] = useState(false);

  // -------------------------------------------------
  // Анімація номерів колонок після натискання
  // -------------------------------------------------

  const showDigitsFromPressed =
    isLastVisitedPageWasFoundResults &&
    indexesOfFoundResultsForCurrentPage.length > 0 &&
    isPagesNavbarLinkPressed
      ? "showColnumbersWhenPagesLinkOnCurrentPagePressed"
      : "";

  // -------------------------------------------------
  // Чи показувати colNumbers
  // -------------------------------------------------

  const shouldShowColNumbers =
    indexesOfFoundResultsForCurrentPage.length > 0 &&
    (
      isPagesNavbarLinkPressed ||
      showPreviousPageHighlight
    );

  // -------------------------------------------------
  // Підсвітка після переходу з foundResults
  // -------------------------------------------------

  useEffect(() => {
    let timer;

    if (isPreviousPageWasFoundResult) {
      setShowPreviousPageHighlight(true);

      timer = setTimeout(() => {
        setShowPreviousPageHighlight(false);
      }, 3000);
    } else {
      setShowPreviousPageHighlight(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isPreviousPageWasFoundResult]);

  return {
    showDigitsFromPressed,
    shouldShowColNumbers,
    showPreviousPageHighlight,
  };
};