import { useEffect, useRef } from "react";
import { useDataLoader, useRowHighlighting, useFilteredPageData, useSearchToggle } from "../../redux/hooks/hooks";
import s from "../../Components/PhonesTable/PhonesTable.module.css";
import { useSelector } from "react-redux";
import { isCurrentPageFoundResult } from "../selectors/selector";
import { useRowHeights } from "./useSyncRowHeights";
import { useFoundResultsColNumbersLogic } from "./hooks"; // універсальний хук

export const usePhonesTableLogic = ({
  columns,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  departmentsAndSectionsPerPage,
  foundResults = [],
  indexDataOfFoundResultsForFoundResultsPage = []
}) => {
  const rowRefs = useRef([]);
  const colNumbersRef = useRef([]);

  const { data: phonesData, isPreviousPageWasFoundResult } = useDataLoader();
  const { isPagesNavbarLinkElementOnCurrentPagePressed } = useSearchToggle();

  const safeFoundResults = foundResults || [];
  const safeIndexData = indexDataOfFoundResultsForFoundResultsPage || [];
  const isFoundResults = useSelector(isCurrentPageFoundResult("phones"));
  // const isFoundResults =true;
  

  const { data: filteredPageData, isFilterApplied } = useFilteredPageData(phonesData);


  const pageData = isFoundResults
    ? safeFoundResults
    : isFilterApplied
      ? filteredPageData?.[pageNumber - 1]?.rows ?? []
      : phonesData?.[pageNumber - 1]?.rows ?? [];
  const phoneColumns = columns.find(c => c.key === "phones")?.subLabels.length || 0;
  const indexDecrementFromPreviousPages = departmentsAndSectionsPerPage
    .slice(0, pageNumber - 1)
    .reduce((acc, val) => acc + val, 0);

  const { renderIndexCell } = useRowHighlighting(
    indexDataOfFoundResultsForFoundResultsPage,
    s,
    "phones",
    rowRefs,
    safeIndexData
  );

  // Використання універсального хука для colNumbers та highlight
  const { showDigitsFromPressed, shouldShowColNumbers, showPreviousPageHighlight } =
    useFoundResultsColNumbersLogic({
      isFoundResults,
      indexesOfFoundResultsForCurrentPage,
      isPagesNavbarLinkPressed: isPagesNavbarLinkElementOnCurrentPagePressed,
      isPreviousPageWasFoundResult,
    });

  // Синхронізація висот рядків
  const syncHeights = () => {
    rowRefs.current.forEach((tr, i) => {
      if (tr && colNumbersRef.current[i]) {
        const td = tr.querySelector(`td[data-key='${tr.dataset.key}']`) || tr.querySelector("td");
        if (td) {
          colNumbersRef.current[i].style.height = `${td.offsetHeight}px`;
        }
      }
    });
  };

  useRowHeights(rowRefs, colNumbersRef, [pageData]);

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

