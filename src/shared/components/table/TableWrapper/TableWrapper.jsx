import s from "./TableWrapper.module.css";
import ColNumbers from "./subComponents/ColNumbers";
import TableWrapperHead from "./subComponents/TableWrapperHead";
import TableWrapperBody from "./subComponents/TableWrapperBody/TableWrapperBody";
import { getRowClass } from "./helpers";
import "../../../Css/Table.css";


const TableWrapper = ({ tableLogic, tableUI, tableDrag, tableHelpers, renderHeader = () => null, renderRowCells }) => {
  const {
    pageData,
    showDigitsFromPressed,
    shouldShowColNumbers,
    colNumbersRef,
    headerRef,
    rowRefs,
    indexesOfFoundResultsForCurrentPage,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    shouldRenderIndexesHeader
  } = tableLogic;
  const { 
       isSections,
        menu,
        currentMode,
        editMode,
        page} = tableUI

console.log("PAGE-DATA:", pageData)
  return (
    <div className={`${s.tableWrapper} ${showDigitsFromPressed}`}>
      {shouldShowColNumbers && <ColNumbers pageData={pageData} colNumbersRef={colNumbersRef} />}

      <table>
        <TableWrapperHead
          headerRef={headerRef}
          renderHeader={renderHeader}
          shouldRenderIndexesHeader={shouldRenderIndexesHeader}
        />
        <TableWrapperBody
          pageData={pageData}
          rowRefs={rowRefs}
          renderRowCells={renderRowCells}
          getRowClass={getRowClass}
          rowClassParams={{
            indexesOfFoundResults: indexesOfFoundResultsForCurrentPage,
            showPreviousPageHighlight,
            isPagesNavbarLinkPressed: isPagesNavbarLinkElementOnCurrentPagePressed,

          }}
            editMode = {editMode}
            isSections = {isSections}
            currentMode= {currentMode}
            menu = {menu}
            page = {page}
            // tableLogic={tableLogic}
            tableDrag = {tableDrag} 
            tableHelpers = {tableHelpers}
        />
      </table>
    </div>
  );
};

export default TableWrapper;


