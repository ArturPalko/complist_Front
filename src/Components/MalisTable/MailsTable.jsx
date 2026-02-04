import React, { useRef } from "react";
import s from "../../Components/PhonesTable/PhonesTable.module.css";
import "../CommonInjection/Css/Table.css";
import { useMailsTableLogic } from "../../redux/hooks/useMailsTableLogic";
import { useFoundResults } from "../../redux/hooks/hooks";
import TableWrapper from "../CommonInjection/TableWrapper/TableWrapper";

const MailsTable = ({
  titleRef,
  mailType,
  columns,
  showPasswords,
  passwordsMap,
  rowsPerPage,
  pageNumber,
  indexesOfFoundResultsForCurrentPage,
}) => {
  const headerRef = useRef(null);

  const { foundResults, indexDataOfFoundResultsForFoundResultsPage } =
    useFoundResults() || { foundResults: [], indexDataOfFoundResultsForFoundResultsPage: [] };

  const {
    pageData,
    rowRefs,
    colNumbersRef,
    renderIndexCell,
    showDigitsFromPressed,
    showPreviousPageHighlight,
    isPagesNavbarLinkElementOnCurrentPagePressed,
    shouldShowColNumbers,
  } = useMailsTableLogic({
    mailType,
    pageNumber,
    rowsPerPage,
    foundResults,
    indexesOfFoundResultsForCurrentPage,
    indexDataOfFoundResultsForFoundResultsPage,
    titleRef,
    headerRef,
  });

  // Функція для рендеру шапки
  const renderHeader = () => (
    <tr>
      <th>№ п/п</th>
      {columns.map((col) => (
        <th key={col.key}>{col.label}</th>
      ))}
      {showPasswords && <th>Пароль</th>}
    </tr>
  );

  // Функція для рендеру рядків
  const renderRowCells = (item, index) => (
    <>
      <td>{(pageNumber - 1) * rowsPerPage + index + 1}</td>
      {columns.map((col) => (
        <td key={col.key}>{item[col.key]}</td>
      ))}
      {showPasswords && <td>{passwordsMap[item.id] || "—"}</td>}
    </>
  );

  return (
      <TableWrapper
        pageData={pageData}
        showDigitsFromPressed={showDigitsFromPressed}
        shouldShowColNumbers={shouldShowColNumbers}
        colNumbersRef={colNumbersRef}
        headerRef={headerRef}
        pageNumber={pageNumber}
        rowsPerPage={rowsPerPage}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
        showPreviousPageHighlight={showPreviousPageHighlight}
        isPagesNavbarLinkElementOnCurrentPagePressed={isPagesNavbarLinkElementOnCurrentPagePressed}
        renderIndexCell={renderIndexCell}
        renderHeader={renderHeader}
        renderRowCells={renderRowCells}
        rowRefs={rowRefs}
        indexDataOfFoundResultsForFoundResultsPage={indexDataOfFoundResultsForFoundResultsPage}
      />
  );
};

export default MailsTable;
