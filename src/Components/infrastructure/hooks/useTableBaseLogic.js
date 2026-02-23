// useTableBaseLogic.js
import { useRef, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  useFilteredPageData,
  useFoundResultsColNumbersLogic,
} from "../../../redux/hooks/hooks";

import { useRowHeights } from "../../../redux/hooks/useSyncRowHeights";

import {
  activeMenu,
  isCurrentPageFoundResult,
} from "../../../redux/selectors/selector";

import { useDataLoader, useSearchToggle } from "../../../redux/contexts/useConetxt";

export const useTableBaseLogic = ({
  columns,
  pageNumber,
  indexesOfFoundResultsForCurrentPage = [],
  foundResults = [],
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
  const { data, isPreviousPageWasFoundResult } = useDataLoader(pageName);
  
  const { isPagesNavbarLinkElementOnCurrentPagePressed } = useSearchToggle();

  // ================================
  // safe values
  // ================================
  const safeFoundResults = foundResults ?? [];

  // ================================
  // filtering
  // ================================
  const { data: filteredPageData, isFilterApplied } = useFilteredPageData(data);

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
    isPagesNavbarLinkPressed: isPagesNavbarLinkElementOnCurrentPagePressed,
    isPreviousPageWasFoundResult,
  });

  // ================================
  // sync row heights
  // ================================
  useRowHeights(rowRefs, colNumbersRef, [pageData], headerRef, titleRef);

  // ================================
  // columns count (опціонально)
  // ================================
  const tableColumns = useMemo(() => {
    if (!columns) return undefined; // якщо columns не передані – не повертаємо
    const column = columns.find((c) => c.key === pageName);
    return column?.subLabels?.length;
  }, [columns, pageName]);

  // ================================
  // return
  // ================================

  return {
    // data
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
    ...(columns ? { pageColumns: tableColumns } : {}), // повертаємо тільки якщо columns передані


  };
};
