import { useEffect, useRef, useState } from "react";
import { useDataLoader, useFoundResults, useToggleElements } from "./hooks";
import { useRowHighlighting , useFilteredPageData} from "./hooks";
import { useRowHeights } from "./useSyncRowHeights";
import s from "../../Components/PhonesTable/PhonesTable.module.css";


export const useMailsTableLogic = ({
  mailType,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage
}) => {
  const [showPreviousPageHighlight, setShowPreviousPageHighlight] = useState(false);

  const { data: mailsData, isPreviousPageWasFoundResult } = useDataLoader();
  const { foundResults, indexDataOfFoundResultsForFoundResultsPage } = useFoundResults();
  const { isPagesNavbarLinkElementOnCurrentPagePressed } = useToggleElements();


  const filteredPageData = useFilteredPageData(mailsData);
  debugger;


const pageData = foundResults ?? filteredPageData?.[pageNumber - 1]?.rows  ?? mailsData?.[pageNumber - 1]?.rows ?? [];




  const rowRefs = useRef([]);
  const colNumbersRef = useRef([]);

  const { renderIndexCell } = useRowHighlighting(
    indexDataOfFoundResultsForFoundResultsPage,
    s,
    `mails/${mailType}`,
    rowRefs
  );

  const showDigitsFromPressed =
    indexesOfFoundResultsForCurrentPage.length !== 0 &&
    isPagesNavbarLinkElementOnCurrentPagePressed
      ? s.showColnumbersWhenPagesLinkOnCurrentPagePressed
      : "";

  useRowHeights(rowRefs, colNumbersRef, [pageData]);

  useEffect(() => {
    if (isPreviousPageWasFoundResult) {
      setShowPreviousPageHighlight(true);
      const timer = setTimeout(() => setShowPreviousPageHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPreviousPageWasFoundResult]);

  return {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    indexDataOfFoundResultsForFoundResultsPage
  };
};
