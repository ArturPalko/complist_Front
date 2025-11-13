import s from "./PhonesTable.module.css";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRowHighlighting, useDataLoader, useFoundResults, useToggleElements} from "../../redux/hooks/hooks";

const PhonesTable = ({
  isDataFetching,
  columns,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  isRenderFromFoundResultsPage,
 departmentsAndSectionsPerPage
}) => {

  const rowRefs = useRef({});
  const {data: phonesData, isPreviousPageWasFoundResult} = useDataLoader();
  const {isPagesNavbarLinkElementOnCurrentPagePressed} = useToggleElements();
    const {foundResults, indexDataOfFoundResultsForFoundResultsPage} = useFoundResults();
  let pageData = foundResults ?? phonesData?.[pageNumber - 1]?.rows ?? [];
  let indexDecrement = 0;
  const phoneColumns = columns.find(c => c.key === "phones")?.subLabels.length || 0;
const indexDecrementFromPreviousPages = departmentsAndSectionsPerPage.slice(0, pageNumber-1).reduce((acc, val) => acc + val, 0);
debugger;
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
console.log("departmentPerera:", departmentsAndSectionsPerPage);
debugger;

  return (
 
    <div className={s.content}>
        <div className={s.tableWrapper + " " + showDigitsFromPressed}>
         {((isPreviousPageWasFoundResult || isPagesNavbarLinkElementOnCurrentPagePressed )&& indexesOfFoundResultsForCurrentPage.length !== 0) && <div className={s.colNumbers}>
            {Array.from({ length: pageData.length}, (_, i) => (
              <div  key={i}>{i+1}</div>
            ))}
         </div>}
  
          <table>
            <thead>
              <tr>
                {indexDataOfFoundResultsForFoundResultsPage && <th rowSpan="2" className={s.indexesColumnHeader}>Індекси</th>}
                <th rowSpan="2">№ п/п</th>
                {columns.map((col) =>
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
            const rowClass = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPreviousPageWasFoundResult
              ? `${s.searchedRow} ${(index + 1) % 2 === 0 ? s.even : s.odd}`
              : "";
              const rowClassFronPressed = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPagesNavbarLinkElementOnCurrentPagePressed ? s.focusOnsearchedResultsWhenPagesLinkOnCurrentPagePressed : '';


                const hideClass = indexesOfFoundResultsForCurrentPage.length !== 0 && isPreviousPageWasFoundResult ? s.hideBright : "";
                const hideClassFromPressed =indexesOfFoundResultsForCurrentPage.length !== 0 && isPagesNavbarLinkElementOnCurrentPagePressed ? s.hideBrightWhenPagesLinkOnCurrentPagePressed: '';


                switch (row.type) {
                  case "department":
                    indexDecrement++;
                    return (
                      <tr
                        key={`dep-${row.departmentId}`}
                      >
                          {renderIndexCell(index)}
                          <td className={`${s.mainDepartment}  ${hideClass} ${hideClassFromPressed}`} 
                          colSpan={columns.length + phoneColumns}>
                          {row.departmentName}
                        </td>
                      </tr>
                    );

                  case "section":
                    indexDecrement++;
                    return (
                      <tr
                        key={`sec-${row.sectionId}`}
                      >
                        {renderIndexCell(index)} 
                        <td className={`${s.section} ${hideClass} ${ hideClassFromPressed}`}
                          colSpan={columns.length + phoneColumns}>
                          {row.sectionName}
                        </td>
                      </tr>
                    );

                  case "user":
                    return (
                      <tr
                        key={`user-${row.userId}`}
                      className={`${rowClass} ${rowClassFronPressed}`}

                        data-index={index}
                      >
                        {renderIndexCell(index)} 
                        <td>{(pageNumber-1)*rowsPerPage +index + 1 - indexDecrement-indexDecrementFromPreviousPages}</td>
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
