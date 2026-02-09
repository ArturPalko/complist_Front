import { useEffect, useRef } from "react";
import { useDataLoader, useRowHighlighting, useFilteredPageData, useSearchToggle } from "../../redux/hooks/hooks";
 //import s from "../../Components/PhonesTable/PhonesTable.module.css";
import b from "../../Components/CommonInjection/Arrow.module.css"
import { useSelector } from "react-redux";
import { getDepartmentsAndSectionsPerPage, isCurrentPageFoundResult } from "../selectors/selector";
import { useRowHeights } from "./useSyncRowHeights";
import { useFoundResultsColNumbersLogic } from "./hooks"; // універсальний хук

export const usePhonesTableLogic = ({
  columns,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  departmentsAndSectionsPerPage,
  foundResults = [],
  indexDataOfFoundResultsForFoundResultsPage = [],
  headerRef,
  titleRef
}) => {
  const rowRefs = useRef([]);
  const colNumbersRef = useRef([]);

  const { data: phonesData, isPreviousPageWasFoundResult } = useDataLoader();
  const { isPagesNavbarLinkElementOnCurrentPagePressed } = useSearchToggle();

  const safeFoundResults = foundResults || [];
  const safeIndexData = indexDataOfFoundResultsForFoundResultsPage || [];
  const isLastVisitedPageWasFoundResults = useSelector(isCurrentPageFoundResult("phones"));
  // const isLastVisitedPageWasFoundResults =true;
  

  const { data: filteredPageData, isFilterApplied } = useFilteredPageData(phonesData);


  const pageData = isLastVisitedPageWasFoundResults
    ? safeFoundResults
    : isFilterApplied
      ? filteredPageData?.[pageNumber - 1]?.rows ?? []
      : phonesData?.[pageNumber - 1]?.rows ?? [];

  const phoneColumns = columns.find(c => c.key === "phones")?.subLabels.length || 0;
const indexDecrementFromPreviousPages = useSelector(getDepartmentsAndSectionsPerPage)
  .slice(0, pageNumber - 1)
  .reduce((acc, val) => acc + val, 0);

  const { renderIndexCell } = useRowHighlighting(
    indexDataOfFoundResultsForFoundResultsPage,
    b,
    "phones",
    rowRefs,
    safeIndexData
  );

  // Використання універсального хука для colNumbers та highlight
  const { showDigitsFromPressed, shouldShowColNumbers, showPreviousPageHighlight } =
    useFoundResultsColNumbersLogic({
      isLastVisitedPageWasFoundResults,
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
    shouldShowColNumbers,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    phoneColumns,
    indexDataOfFoundResultsForFoundResultsPage,
    indexDecrementFromPreviousPages,
    isPreviousPageWasFoundResult,
  };
};

