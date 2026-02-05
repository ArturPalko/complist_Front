import React from "react";
import s from "./TableWrapper.module.css"
import ColNumbers from "./subComponents/ColNumbers";
import TableWrapperHead from "./subComponents/TableWrapperHead";
import TableWrapperBody from "./subComponents/TableWrapperBody";
import { getRowClass } from "./helpers";
import "../Css/Table.css"


const TableWrapper = ({
  pageData,
  showDigitsFromPressed,
  shouldShowColNumbers,
  colNumbersRef,
  headerRef,
  indexesOfFoundResultsForCurrentPage,
  showPreviousPageHighlight,
  isPagesNavbarLinkElementOnCurrentPagePressed,
  renderIndexCell = () => null,
  renderHeader = () => null,
  renderRowCells,
  rowRefs,
  indexDataOfFoundResultsForFoundResultsPage,
  
}) => (
  <div className={`${s.tableWrapper} ${showDigitsFromPressed}`}>
    {shouldShowColNumbers && <ColNumbers pageData={pageData} colNumbersRef={colNumbersRef} />}

    <table>
      <TableWrapperHead
        headerRef={headerRef}
        renderHeader={renderHeader}
        showIndexes={indexDataOfFoundResultsForFoundResultsPage}
      />
      <TableWrapperBody
        pageData={pageData}
        rowRefs={rowRefs}
        renderRowCells={renderRowCells}
        renderIndexCell={renderIndexCell}
        getRowClass={getRowClass}
        rowClassParams={{
          indexesOfFoundResults: indexesOfFoundResultsForCurrentPage,
          showPreviousPageHighlight,
          isPagesNavbarLinkPressed: isPagesNavbarLinkElementOnCurrentPagePressed
        }}
      />
    </table>
  </div>
);

export default TableWrapper;
