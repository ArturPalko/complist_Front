import React from "react";
import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../redux/hooks/usePhonesTableLogic";
import { useFoundResults } from "../../redux/hooks/hooks";

const PhonesTable = ({
  isDataFetching,
  columns,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  isRenderFromFoundResultsPage,
  departmentsAndSectionsPerPage
}) => {

  const { foundResults, indexDataOfFoundResultsForFoundResultsPage } = useFoundResults() || { foundResults: [], indexDataOfFoundResultsForFoundResultsPage: [] };
  const {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    phoneColumns,
    indexDecrementFromPreviousPages,
    shouldShowColNumbers
  } = usePhonesTableLogic({
    columns,
    pageNumber,
    rowsPerPage,
    indexesOfFoundResultsForCurrentPage,
    departmentsAndSectionsPerPage,
    foundResults,
    indexDataOfFoundResultsForFoundResultsPage
  });
  let indexDecrement = 0;
  // debugger
  return (
    <div className={s.content}>
      <div className={s.tableWrapper + " " + showDigitsFromPressed}>
        {shouldShowColNumbers && (
          <div className={s.colNumbers}>
            {Array.from({ length: pageData.length }, (_, i) => (
              <div key={i} ref={el => (colNumbersRef.current[i] = el)}>
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <table>
          <thead>
            <tr>
              {indexDataOfFoundResultsForFoundResultsPage && <th rowSpan="2" className={s.indexesColumnHeader}>Індекси</th>}
              <th rowSpan="2">№ п/п</th>
              {columns.map(col =>
                col.key === "phones" ? (
                  <th key={col.key} colSpan={col.subLabels.length}>{col.label}</th>
                ) : (
                  <th key={col.key} rowSpan="2">{col.label}</th>
                )
              )}
            </tr>
            <tr>
              {columns
                .filter(c => c.key === "phones")
                .flatMap(col =>
                  col.subLabels.map(sub => <th key={sub.key}>{sub.label}</th>)
                )}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, index) => {
              const rowClass = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && showPreviousPageHighlight
                ? `${s.searchedRow} ${(index + 1) % 2 === 0 ? s.even : s.odd}`
                : "";
              const rowClassFromPressed = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPagesNavbarLinkElementOnCurrentPagePressed
                ? s.focusOnsearchedResultsWhenPagesLinkOnCurrentPagePressed
                : "";

              const hideClass = indexesOfFoundResultsForCurrentPage.length !== 0 && showPreviousPageHighlight ? s.hideBright : "";
              const hideClassFromPressed = indexesOfFoundResultsForCurrentPage.length !== 0 && isPagesNavbarLinkElementOnCurrentPagePressed ? s.hideBrightWhenPagesLinkOnCurrentPagePressed : "";

              const refCallback = el => (rowRefs.current[index] = el);
              let key = index;

              switch (row.type) {
                case "department":
                  indexDecrement++;
                  return (
                    <tr key={`dep-${row.departmentId}`} ref={refCallback}>
                      {renderIndexCell(index)}
                      <td
                        className={`${s.mainDepartment} ${hideClass} ${hideClassFromPressed}`}
                        colSpan={columns.length + phoneColumns}
                        style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                        data-key={`department--${index}`}
                      >
                        {row.departmentName}
                      </td>
                    </tr>
                  );
                case "section":
                  indexDecrement++;
                  return (
                    <tr key={`sec-${row.sectionId}`} ref={refCallback}>
                      {renderIndexCell(index)}
                      <td
                        className={`${s.section} ${hideClass} ${hideClassFromPressed}`}
                        colSpan={columns.length + phoneColumns}
                        style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                        data-key={`section--${index}`}
                      >
                        {row.sectionName}
                      </td>
                    </tr>
                  );
                case "user":
                  return (
                    <tr
                      key={`user-${row.userId}`}
                      className={`${rowClass} ${rowClassFromPressed}`}
                      data-index={index}
                      ref={refCallback}
                      data-key={`user--${index}`}
                    >
                      {renderIndexCell(index)}
                      <td>{(pageNumber - 1) * rowsPerPage + index + 1 - indexDecrement - indexDecrementFromPreviousPages}</td>
                      {row.userTypeId !== 1 ? (
                        <>
                          <td>{row.userName}</td>
                          <td></td>
                        </>
                      ) : (
                        <>
                          <td>{row.userPosition}</td>
                          <td>{row.userName}</td>
                        </>
                      )}
                      {columns.find(c => c.key === "phones")?.subLabels.map(sub => {
                        const phone = row.phones?.find(p => p.phoneType === sub.label);
                        return <td key={sub.key}>{phone ? phone.phoneName : ""}</td>;
                      })}
                    </tr>
                  );
                default:
                  return null;
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhonesTable;
