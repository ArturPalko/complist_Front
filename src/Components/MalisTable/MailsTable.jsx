import React from "react";
import s from "../../Components/PhonesTable/PhonesTable.module.css";
import "./MailsTable.css";
import { useMailsTableLogic } from "../../redux/hooks/useMailsTableLogic"; // шлях до нового хука
import { useFoundResults } from "../../redux/hooks/hooks";
import { useRef } from "react";

const MailsTable = ({
  titleRef,
  mailType,
  columns,
  showPasswords,
  passwordsMap,
  rowsPerPage,
  pageNumber,
  indexesOfFoundResultsForCurrentPage
}) => {
   const headerRef = useRef(null);
   const { foundResults, indexDataOfFoundResultsForFoundResultsPage } = useFoundResults() || { foundResults: [], indexDataOfFoundResultsForFoundResultsPage: [] };
  const {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    shouldShowColNumbers

  } = useMailsTableLogic({ mailType,
     pageNumber, 
     rowsPerPage,
     foundResults, 
     indexesOfFoundResultsForCurrentPage,
     indexDataOfFoundResultsForFoundResultsPage,
     titleRef,
      headerRef,
   });
   
  return (
    <div className={s.content}>
      <div className={s.tableWrapper + " " + showDigitsFromPressed}>
        {/* {(showPreviousPageHighlight ||
          isPagesNavbarLinkElementOnCurrentPagePressed) &&
          indexesOfFoundResultsForCurrentPage.length !== 0*/shouldShowColNumbers && ( 
            <div className={s.colNumbers} >
              {pageData.map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (colNumbersRef.current[i] = el)}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}

        <table>
          <thead  ref={headerRef} >
            <tr>
              {indexDataOfFoundResultsForFoundResultsPage && (
                <th className={s.indexesColumnHeader}>Індекси</th>
              )}
              <th>№ п/п</th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {showPasswords && <th>Пароль</th>}
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, index) => {
              const rowClass =
                indexesOfFoundResultsForCurrentPage?.includes(index + 1) &&
                showPreviousPageHighlight
                  ? `${s.searchedRow} ${(index + 1) % 2 === 0 ? s.even : s.odd}`
                  : "";
                  
              const rowClassFromPressed =
                indexesOfFoundResultsForCurrentPage?.includes(index + 1) &&
                isPagesNavbarLinkElementOnCurrentPagePressed
                  ? s.focusOnsearchedResultsWhenPagesLinkOnCurrentPagePressed
                  : "";

              return (
                <tr
                  key={item.id || index}
                  ref={(el) => (rowRefs.current[index] = el)}
                  className={`${rowClass} ${rowClassFromPressed}`}
                  data-key={index}
                >
                  {renderIndexCell(index)}
                  <td data-key={index}>
                    {(pageNumber - 1) * rowsPerPage + index + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} data-key={col.key}>
                      {item[col.key]}
                    </td>
                  ))}
                  {showPasswords && <td>{passwordsMap[item.id] || "—"}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MailsTable;
