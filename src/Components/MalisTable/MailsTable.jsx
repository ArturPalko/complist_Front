import React, { useRef } from "react";
import s from "../PhonesTable/PhonesTable.module.css";
import "./MailsTable.css";
import Preloader from "../Preloader/Preloader";
import { useRowHighlighting } from "../../redux/hooks/hooks";

const MailsTable = ({
  mailType,
  foundResults,
  mailsData = [],
  isDataFetching,
  columns,
  title,
  showPasswords,
  passwordsMap,
  rowsPerPage,
  pageNumber,
  indexDataOfFoundResultsForFoundResultsPage,
  indexesOfFoundResultsForCurrentPage,
  isPreviousPageWasFoundResult,
  isPagesNavbarLinkElementOnCurrentPagePressed
}) => {
  const pageData = foundResults ?? mailsData?.[pageNumber - 1]?.rows ?? [];
  const rowRefs = useRef({});
  const { renderIndexCell } = useRowHighlighting(
    indexDataOfFoundResultsForFoundResultsPage,
    s,                    
    `mails/${mailType}`,  
    rowRefs
  );

  return (
    <div className={s.content}>
      <table>
        <thead>
          <tr>
            <th>№ п/п</th>
            {columns.map(col => <th key={col.key}>{col.label}</th>)}
            {showPasswords && <th>Пароль</th>}
            {indexDataOfFoundResultsForFoundResultsPage && <th>Індекси</th>}
          </tr>
        </thead>
        <tbody>
         {pageData.map((item, index) => {
            const rowClass = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPreviousPageWasFoundResult
              ? `${s.searchedRow} ${(index + 1) % 2 === 0 ? s.even : s.odd}`
              : "";
            const rowClassFromPressed = indexesOfFoundResultsForCurrentPage?.includes(index + 1) && isPagesNavbarLinkElementOnCurrentPagePressed
              ? s.focusOnsearchedResultsWhenPagesLinkOnCurrentPagePressed
              : "";

            return (
              <tr key={item.id || index} className={`${rowClass} ${rowClassFromPressed}`}>
                <td>{(pageNumber - 1) * rowsPerPage + index + 1}</td>
                {columns.map(col => <td key={col.key}>{item[col.key]}</td>)}
                {renderIndexCell(index)}
                {showPasswords && <td>{passwordsMap[item.id] || "—"}</td>}
             </tr>
           );
        })} 

        </tbody>
      </table>
    </div>
  );
};

export default MailsTable;
