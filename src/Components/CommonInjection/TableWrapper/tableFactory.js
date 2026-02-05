import React, { useRef } from "react";
import { useFoundResults } from "../../../redux/hooks/hooks";
import TableWrapper from "./TableWrapper";

export const createTableComponent = (useTableLogic, s) => {
  return function TableComponent(props) {
    const headerRef = useRef(null);

    // ===== Беремо дані пошуку з контексту =====
      const { foundResults, indexDataOfFoundResultsForFoundResultsPage } =
    useFoundResults() || { foundResults: [], indexDataOfFoundResultsForFoundResultsPage: [] };

    // ===== Викликаємо конкретний хук логіки таблиці =====
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
      renderIndexCell,
      showDigitsFromPressed,
      showPreviousPageHighlight,
      isPagesNavbarLinkElementOnCurrentPagePressed,
      shouldShowColNumbers,
    } = tableLogic;

    return (
      <TableWrapper
        pageData={pageData}
        showDigitsFromPressed={showDigitsFromPressed}
        shouldShowColNumbers={shouldShowColNumbers}
        colNumbersRef={colNumbersRef}
        headerRef={headerRef}
        indexesOfFoundResultsForCurrentPage={props.indexesOfFoundResultsForCurrentPage}
        showPreviousPageHighlight={showPreviousPageHighlight}
        isPagesNavbarLinkElementOnCurrentPagePressed={isPagesNavbarLinkElementOnCurrentPagePressed}
        renderIndexCell={renderIndexCell}
        renderHeader={props.renderHeader}
        renderRowCells={(row, index) => props.renderRowCells(row, index, tableLogic)}
        rowRefs={rowRefs}
        indexDataOfFoundResultsForFoundResultsPage={indexDataOfFoundResultsForFoundResultsPage}
        s={s} // передаємо стилі
      />
    );
  };
};
