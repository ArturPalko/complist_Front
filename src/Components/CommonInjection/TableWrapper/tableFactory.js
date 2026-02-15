import React, { useRef } from "react";
import { useFoundResults } from "../../../redux/hooks/hooks";
import TableWrapper from "./TableWrapper";
import { IndexCellProvider } from "../../CommonInjection/IndexCell/IndexCellContext";

export const createTableComponent = (useTableLogic, s) => {

  return function TableComponent(props) {

    const headerRef = useRef(null);

    // ===== Беремо дані пошуку =====
    const {
      foundResults,
      indexDataOfFoundResultsForFoundResultsPage
    } = useFoundResults() || {
      foundResults: [],
      indexDataOfFoundResultsForFoundResultsPage: []
    };

    // ===== Викликаємо хук логіки =====
    const tableLogic = useTableLogic({
      ...props,
      headerRef,
      foundResults,
      indexDataOfFoundResultsForFoundResultsPage,
    });

    const {
      pageData,
      rowRefs,
      colNumbersRef,

      indexCellContextValue, // ✅ НОВЕ

      showDigitsFromPressed,
      showPreviousPageHighlight,
      isPagesNavbarLinkElementOnCurrentPagePressed,
      shouldShowColNumbers,

    } = tableLogic;

    return (

      <IndexCellProvider value={indexCellContextValue}>

        <TableWrapper
          pageData={pageData}
          showDigitsFromPressed={showDigitsFromPressed}
          shouldShowColNumbers={shouldShowColNumbers}
          colNumbersRef={colNumbersRef}
          headerRef={headerRef}
          indexesOfFoundResultsForCurrentPage={
            props.indexesOfFoundResultsForCurrentPage
          }
          showPreviousPageHighlight={showPreviousPageHighlight}
          isPagesNavbarLinkElementOnCurrentPagePressed={
            isPagesNavbarLinkElementOnCurrentPagePressed
          }
          renderHeader={props.renderHeader}
          renderRowCells={(row, index) =>
            props.renderRowCells(row, index, tableLogic)
          }
          rowRefs={rowRefs}
        />

      </IndexCellProvider>

    );
  };
};
