import { useRef, useMemo, useCallback } from "react";
import { useFoundResults, usePageContext } from "../../../../../redux/contexts/useConetxt";
import TableWrapper from "./TableWrapper";

export const createTableComponent = (useTableLogic) => {
  return function TableComponent(props) {
    const headerRef = useRef(null);

    // ✅ беремо value з контексту
    const pageContext = usePageContext();

    const {
      foundResults = [],
      indexDataOfFoundResultsForFoundResultsPage = []
    } = useFoundResults() || {};

    const stableFoundResults = useMemo(() => foundResults, [foundResults]);
    const stableIndexData = useMemo(
      () => indexDataOfFoundResultsForFoundResultsPage,
      [indexDataOfFoundResultsForFoundResultsPage]
    );

    const shouldRenderIndexesHeader =
      stableIndexData.length > 0;

    const stablePageContext = useMemo(() => ({
      titleRef: pageContext?.titleRef,
      columns: pageContext?.columns,
      pageNumber: pageContext?.pageNumber,
      indexesOfFoundResultsForCurrentPage:
        pageContext?.indexesOfFoundResultsForCurrentPage
    }), [
      pageContext?.titleRef,
      pageContext?.columns,
      pageContext?.pageNumber,
      pageContext?.indexesOfFoundResultsForCurrentPage
    ]);

    const baseLogic = useTableLogic({
      headerRef,
      foundResults: stableFoundResults,
      indexesOfFoundResultsForCurrentPage:
        stablePageContext.indexesOfFoundResultsForCurrentPage,
      titleRef: stablePageContext.titleRef,
      columns: stablePageContext.columns,
      pageNumber: stablePageContext.pageNumber
    });

    const tableLogic = useMemo(() => ({
      ...baseLogic,
      headerRef,
      indexDataOfFoundResultsForFoundResultsPage: stableIndexData,
      indexesOfFoundResultsForCurrentPage:
        stablePageContext.indexesOfFoundResultsForCurrentPage,
      shouldRenderIndexesHeader
    }), [
      baseLogic,
      stableIndexData,
      stablePageContext.indexesOfFoundResultsForCurrentPage
    ]);

    const renderRowCellsMemo = useCallback(
      (row, index) => props.renderRowCells(row, index, tableLogic),
      [props.renderRowCells, tableLogic]
    );

    return (
      <TableWrapper
        tableLogic={tableLogic}
        renderHeader={props.renderHeader}
        renderRowCells={renderRowCellsMemo}
      />
    );
  };
};