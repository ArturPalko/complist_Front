import { useEffect, useRef } from "react";
import { useDataLoader, useFoundResults, useSearchToggle } from "./hooks";
import { useRowHighlighting, useFilteredPageData } from "./hooks";
import { useRowHeights } from "./useSyncRowHeights";
import s from "../../Components/PhonesTable/PhonesTable.module.css";
import { useSelector } from "react-redux";
import { isCurrentPageFoundResult } from "../selectors/selector";
import { useFoundResultsColNumbersLogic } from "./hooks"; // універсальний хук

export const useMailsTableLogic = ({
  mailType,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  foundResults = [],
  indexDataOfFoundResultsForFoundResultsPage = [],
  titleRef,
  headerRef
}) => {
  const rowRefs = useRef([]);
  const colNumbersRef = useRef([]);

  const { data: mailsData, isPreviousPageWasFoundResult } = useDataLoader();
  
  const { isPagesNavbarLinkElementOnCurrentPagePressed } = useSearchToggle();

  const safeFoundResults = foundResults || [];
  const safeIndexData = indexDataOfFoundResultsForFoundResultsPage || [];
  const menu = mailType;
  debugger;
  const isFoundResults = useSelector(isCurrentPageFoundResult(menu));

  const { data: filteredPageData, isFilterApplied } = useFilteredPageData(mailsData);
  
  const pageData = isFoundResults
    ? safeFoundResults
    : isFilterApplied
      ? filteredPageData?.[pageNumber - 1]?.rows ?? []
      : mailsData?.[pageNumber - 1]?.rows ?? [];

  const { renderIndexCell } = useRowHighlighting(
    indexDataOfFoundResultsForFoundResultsPage,
    s,
    menu,
    rowRefs,
    safeIndexData
  );

  const { showDigitsFromPressed, shouldShowColNumbers, showPreviousPageHighlight } =
    useFoundResultsColNumbersLogic({
      isFoundResults,
      indexesOfFoundResultsForCurrentPage,
      isPagesNavbarLinkPressed: isPagesNavbarLinkElementOnCurrentPagePressed,
      isPreviousPageWasFoundResult,
    });

    useRowHeights(rowRefs, colNumbersRef, [pageData],headerRef,titleRef);

  return {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    shouldShowColNumbers,
    indexDataOfFoundResultsForFoundResultsPage,
    indexesOfFoundResultsForCurrentPage,
  };
};
