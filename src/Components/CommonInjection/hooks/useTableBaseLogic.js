// useTableBaseLogic.js

import { useRef, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  useDataLoader,
  useFilteredPageData,
  useSearchToggle,
  useFoundResultsColNumbersLogic,
} from "../../../redux/hooks/hooks";

import { useRowHeights } from "../../../redux/hooks/useSyncRowHeights";

import {
  activeMenu,
  isCurrentPageFoundResult,
} from "../../../redux/selectors/selector";

// import b from "../../CommonInjection/Css/Arrow.module.css";

export const useTableBaseLogic = ({
  columns,
  pageNumber,
  indexesOfFoundResultsForCurrentPage = [],
  foundResults = [],
  indexDataOfFoundResultsForFoundResultsPage = [],
  headerRef,
  titleRef,
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

  const isLastVisitedPageWasFoundResults =
    useSelector(isCurrentPageFoundResult(pageName));

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

  const safeFoundResults = foundResults ?? [];

  const safeIndexData =
    indexDataOfFoundResultsForFoundResultsPage ?? [];

  // ================================
  // filtering
  // ================================

  const {
    data: filteredPageData,
    isFilterApplied,
  } = useFilteredPageData(data);

  // ================================
  // pageData calculation
  // ================================

  const pageData = useMemo(() => {

    if (isLastVisitedPageWasFoundResults) {
      return safeFoundResults;
    }

    if (isFilterApplied) {
      return filteredPageData?.[pageNumber - 1]?.rows ?? [];
    }

    return data?.[pageNumber - 1]?.rows ?? [];

  }, [
    isLastVisitedPageWasFoundResults,
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

    return (
      columns?.find(c => c.key === pageName)
        ?.subLabels.length ?? 0
    );

  }, [columns, pageName]);

  // ================================
  // Context value for IndexCellProvider
  // ================================

  const indexCellContextValue = useMemo(() => {

    return {

      indexDataOfFoundResultsForFoundResultsPage,

      safeIndexData,

      pageName,

      rowRefs,

      // arrowStyles: b,

    };

  }, [
    indexDataOfFoundResultsForFoundResultsPage,
    safeIndexData,
    pageName,
  ]);

  // ================================
  // return
  // ================================

  return {

    // data
    pageData,

    // refs
    rowRefs,
    colNumbersRef,

    // provider value
    indexCellContextValue,

    // found results logic
    showDigitsFromPressed,
    shouldShowColNumbers,
    showPreviousPageHighlight,

    // navigation state
    isPagesNavbarLinkElementOnCurrentPagePressed,

    // table config
    pageColumns: tableColumns,

    // extra
    indexDataOfFoundResultsForFoundResultsPage,
    indexesOfFoundResultsForCurrentPage,
    isPreviousPageWasFoundResult,

  };

};
