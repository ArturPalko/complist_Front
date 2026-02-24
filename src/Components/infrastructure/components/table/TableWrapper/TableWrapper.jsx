import s from "./TableWrapper.module.css";
import ColNumbers from "./subComponents/ColNumbers";
import TableWrapperHead from "./subComponents/TableWrapperHead";
import TableWrapperBody from "./subComponents/TableWrapperBody";
import { getRowClass } from "./helpers";
import "../../../Css/Table.css";
import {selectIndexesFromCell} from "../../../../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addIndexesFromIndexCell } from "../../../../../redux/reducers/toggledElements-reducer";
import { useEffect } from "react";


const TableWrapper = ({ tableLogic, renderHeader = () => null, renderRowCells }) => {
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
  const dispatch = useDispatch();
  debugger;
  // ✅ викликаємо hook тут
  const indexes = useSelector(selectIndexesFromCell);
  useEffect(() => {
    
  if (indexes) {
    const timer = setTimeout(() => dispatch(addIndexesFromIndexCell([])), 2000);
    return () => clearTimeout(timer);
  }
}, [indexes]);

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
            isPagesNavbarLinkPressed: isPagesNavbarLinkElementOnCurrentPagePressed
          }}
        />
      </table>
    </div>
  );
};

export default TableWrapper;
