import React from "react";
// import s from "../../Components/PhonesTable/PhonesTable.module.css";
import s from "../CommonInjection/TableWrapper.module.css"

const TableWrapper = ({
  pageData,
  showDigitsFromPressed,
  shouldShowColNumbers,
  colNumbersRef,
  headerRef,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  showPreviousPageHighlight,
  isPagesNavbarLinkElementOnCurrentPagePressed,
  renderIndexCell = () => null,
  renderHeader = () => null,
  renderRowCells,
  rowRefs,
indexDataOfFoundResultsForFoundResultsPage
}) => {
  // Функція для класів рядків
  const getRowClass = (index) => {
    const baseClass =
      indexesOfFoundResultsForCurrentPage?.includes(index + 1) &&
      showPreviousPageHighlight
        ? `${s.focusOnSearchedRowFade} ${(index + 1) % 2 === 0 ? s.even : s.odd}`
        : "";

    const pressedClass =
      indexesOfFoundResultsForCurrentPage?.includes(index + 1) &&
      isPagesNavbarLinkElementOnCurrentPagePressed
        ? s.focusOnSearchedRow
        : "";

    return `${baseClass} ${pressedClass}`;
  };

  return (
    <div className={`${s.tableWrapper} ${showDigitsFromPressed}`}>
      {shouldShowColNumbers && (
        <div className={s.colNumbers}>
          {pageData.map((_, i) => (
            <div
              key={i}
              ref={(el) => (colNumbersRef.current[i] = el)}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}

      <table>
        
      <thead ref={headerRef}>
      <tr>
        {indexDataOfFoundResultsForFoundResultsPage && (
          <th rowSpan="3" className={s.indexesColumnHeader}>
            Індекси
          </th>
        )}
      </tr>
      {renderHeader?.()}
    </thead>
    

        <tbody>
          {pageData.map((item, index) => (
            <tr
              key={item.id || index}
              className={getRowClass(index)}
              data-key={index}
              ref={(el) => rowRefs?.current && (rowRefs.current[index] = el)}
            >
              {renderIndexCell(index)}
              {renderRowCells(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWrapper;

