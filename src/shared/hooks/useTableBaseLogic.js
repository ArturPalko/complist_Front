import { useRef, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  useFilteredPageData,
  useFoundResultsColNumbersLogic,
} from "../../redux/hooks/hooks";

import { useFoundResults } from "../../redux/hooks/useFoundResults";
import { useRowHeights } from "../../redux/hooks/useSyncRowHeights";

import {
  activeMenu,
  isCurrentPageFoundResult,
  getSearchMode,
  getCurrentMode,
  selectSearchStateByMenu,
} from "../../redux/selectors/selector";

import {
  useDataLoader,
  useSearchToggle,
} from "../../redux/contexts/useConetxt";

import {
  Pages,
  rowsPerPage,
} from "../../configs/app/constants";

export const useTableBaseLogic = ({
  columns,
  pageNumber,
  indexesOfFoundResultsForCurrentPage = [],
  foundResults = [],
  headerRef,
  titleRef,
  dataSelector,
}) => {
  // ================================
  // refs
  // ================================

  const rowRefs = useRef([]);
  const colNumbersRef = useRef([]);

  // ================================
  // redux state
  // ================================

  const pageName = useSelector(activeMenu);
  const currentMode = useSelector(getCurrentMode);
  const searchMode = useSelector(getSearchMode);

  const isSearchFilterMode =
    searchMode === "filter";

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : pageName;

  const isLastVisitedPageWasFoundResults =
    useSelector(
      isCurrentPageFoundResult(pageName)
    );

  // ================================
  // search state
  // ================================

  const searchState = useSelector((state) =>
    selectSearchStateByMenu(
      state,
      searchKey
    )
  );

  // ================================
  // data loading
  // ================================

  const {
    data,
    isPreviousPageWasFoundResult,
  } = useDataLoader(pageName);

  const {
    isPagesNavbarLinkElementOnCurrentPagePressed,
  } = useSearchToggle();

  // ================================
  // safe values
  // ================================

  const safeFoundResults =
    foundResults ?? [];

  // ================================
  // filtering
  // ================================

  const {
    data: filteredPageData,
    isFilterApplied,
  } = useFilteredPageData(data);

  // ================================
  // search results
  // ================================

  const {
    presentRows: searchResultRows,
  } = useFoundResults(
    data,
    {
      [searchKey]: searchState,
    },
    searchKey,
    isFilterApplied
  );

  const hasSearchResults =
    searchResultRows.length > 0;

  // ================================
  // pageData calculation
  // ================================

  const pageData = useMemo(() => {
    /*
     * ==========================================
     * СТАРИЙ FOUND RESULTS MODE
     * ==========================================
     *
     * Якщо відкривається стара сторінка
     * /foundResults — залишаємо стару
     * поведінку.
     */

    if (isLastVisitedPageWasFoundResults) {
      return safeFoundResults;
    }

    /*
     * ==========================================
     * НОВИЙ SEARCH FILTER MODE
     * ==========================================
     *
     * useFoundResults повертає плоский масив:
     *
     * [
     *   row,
     *   row,
     *   row,
     *   ...
     * ]
     *
     * Тут розбиваємо його на сторінки.
     */

    if (
      isSearchFilterMode &&
      hasSearchResults
    ) {
      const startIndex =
        (pageNumber - 1) *
        rowsPerPage;

      const endIndex =
        startIndex + rowsPerPage;

      return searchResultRows.slice(
        startIndex,
        endIndex
      );
    }

    /*
     * ==========================================
     * ЗВИЧАЙНИЙ ФІЛЬТР ДОДАТКА
     * ==========================================
     */

    if (isFilterApplied) {
      return (
        filteredPageData?.[
          pageNumber - 1
        ]?.rows ?? []
      );
    }

    /*
     * ==========================================
     * ЗВИЧАЙНИЙ РЕЖИМ
     * ==========================================
     */

    return (
      data?.[
        pageNumber - 1
      ]?.rows ?? []
    );
  }, [
    isLastVisitedPageWasFoundResults,
    isSearchFilterMode,
    hasSearchResults,
    searchResultRows,
    safeFoundResults,
    isFilterApplied,
    filteredPageData,
    data,
    pageNumber,
  ]);

  // ================================
  // found results logic
  // ================================

  const {
    showDigitsFromPressed,
    shouldShowColNumbers,
    showPreviousPageHighlight,
  } = useFoundResultsColNumbersLogic({
    isLastVisitedPageWasFoundResults,

    indexesOfFoundResultsForCurrentPage,

    isPagesNavbarLinkPressed:
      isPagesNavbarLinkElementOnCurrentPagePressed,

    isPreviousPageWasFoundResult,
  });

  // ================================
  // sync row heights
  // ================================

  useRowHeights(
    rowRefs,
    colNumbersRef,
    [pageData],
    headerRef,
    titleRef
  );

  // ================================
  // columns count
  // ================================

  const tableColumns = useMemo(() => {
    if (!columns) {
      return undefined;
    }

    const column = columns.find(
      (c) => c.key === pageName
    );

    return column?.subLabels?.length;
  }, [
    columns,
    pageName,
  ]);

  // ================================
  // return
  // ================================

  return {
    data,

    pageData,

    // refs
    rowRefs,
    colNumbersRef,

    // found results logic
    showDigitsFromPressed,
    shouldShowColNumbers,
    showPreviousPageHighlight,

    // navigation state
    isPagesNavbarLinkElementOnCurrentPagePressed,

    // table config
    ...(columns
      ? {
          pageColumns: tableColumns,
        }
      : {}),
  };
};