import { useEffect, useRef, useState } from "react";
import { useDataLoader, useFoundResults, useToggleElements, useRowHighlighting,
  useFilteredPageData
 } from "../../redux/hooks/hooks";
import s from "../../Components/PhonesTable/PhonesTable.module.css";

import { useRowHeights } from "./useSyncRowHeights";
export const usePhonesTableLogic = ({
  columns,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  departmentsAndSectionsPerPage
}) => {
  const [showPreviousPageHighlight, setShowPreviousPageHighlight] = useState(false);
  const rowRefs = useRef([]);
  const colNumbersRef = useRef([]);

  const { data: phonesData, isPreviousPageWasFoundResult } = useDataLoader();
  const { isPagesNavbarLinkElementOnCurrentPagePressed } = useToggleElements();
  const { foundResults, indexDataOfFoundResultsForFoundResultsPage } = useFoundResults();

const { data: filteredPageData, isFilterApplied } = useFilteredPageData(phonesData);

  

const pageData =
  foundResults?.[pageNumber - 1]?.rows ??
  (isFilterApplied
    ? filteredPageData?.[pageNumber - 1]?.rows ?? []
    : phonesData?.[pageNumber - 1]?.rows ?? []);


    console.log("phonesData",phonesData)
    console.log("filtredPageData",filteredPageData)


  //   const pageData =
  // foundResults?.[pageNumber - 1]?.rows ??
  // (filteredPageData?.length > 0
  //   ? filteredPageData[pageNumber - 1]?.rows ?? []
  //   : phonesData?.[pageNumber - 1]?.rows ?? []);

  //const pageData = foundResults ?? filteredPageData?.[pageNumber - 1]?.rows  ?? phonesData?.[pageNumber - 1]?.rows ?? [];

  //const pageData = foundResults ?? phonesData?.[pageNumber - 1]?.rows ?? [];
  const phoneColumns = columns.find(c => c.key === "phones")?.subLabels.length || 0;
  const indexDecrementFromPreviousPages = departmentsAndSectionsPerPage.slice(0, pageNumber - 1).reduce((acc, val) => acc + val, 0);

  const { renderIndexCell } = useRowHighlighting(
    indexDataOfFoundResultsForFoundResultsPage,
    s,
    "phones",
    rowRefs
  );

  const showDigitsFromPressed =
    indexesOfFoundResultsForCurrentPage.length !== 0 &&
    isPagesNavbarLinkElementOnCurrentPagePressed
      ? s.showColnumbersWhenPagesLinkOnCurrentPagePressed
      : "";

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
useEffect(() => {
  let timer;

  if (isPreviousPageWasFoundResult) {
    setShowPreviousPageHighlight(true);

    timer = setTimeout(() => setShowPreviousPageHighlight(false), 3000);
  } else {
    setShowPreviousPageHighlight(false);
  }

  return () => clearTimeout(timer);
}, [isPreviousPageWasFoundResult, pageNumber]);


  return {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    phoneColumns,
    indexDataOfFoundResultsForFoundResultsPage,
    indexDecrementFromPreviousPages,
    isPreviousPageWasFoundResult
  };
};
