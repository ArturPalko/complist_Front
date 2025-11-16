import React from "react";
import s from "../../Components/PhonesTable/PhonesTable.module.css";
import "./MailsTable.css";
import { useMailsTableLogic } from "../../redux/hooks/useMailsTableLogic"; // шлях до нового хука

const MailsTable = ({
  mailType,
  columns,
  showPasswords,
  passwordsMap,
  rowsPerPage,
  pageNumber,
  indexesOfFoundResultsForCurrentPage,
}) => {
  const {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    indexDataOfFoundResultsForFoundResultsPage
  } = useMailsTableLogic({ mailType, pageNumber, rowsPerPage, indexesOfFoundResultsForCurrentPage });

  return (
    <div className={s.content}>
      <div className={s.tableWrapper + " " + showDigitsFromPressed}>
        {(showPreviousPageHighlight ||
          isPagesNavbarLinkElementOnCurrentPagePressed) &&
          indexesOfFoundResultsForCurrentPage.length !== 0 && (
            <div className={s.colNumbers} style={{ marginTop: "45px" }}>
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
          <thead>
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
