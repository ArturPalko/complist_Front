import React, { useRef } from "react";
import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../redux/hooks/usePhonesTableLogic";
import { useFoundResults } from "../../redux/hooks/hooks";
import TableWrapper from "../CommonInjection/TableWrapper/TableWrapper";



import {
  countNonUserRowsBefore,
  getUserRowIndex,
  getDimGroupRowClasses,
} from "./phonesTableHelpers"

const PhonesTable = ({
  titleRef,
  columns,
  pageNumber,
  rowsPerPage,
  indexesOfFoundResultsForCurrentPage,
  departmentsAndSectionsPerPage,
}) => {
  const headerRef = useRef(null);

  const { foundResults, indexDataOfFoundResultsForFoundResultsPage } =
    useFoundResults() || {
      foundResults: [],
      indexDataOfFoundResultsForFoundResultsPage: [],
    };

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
    shouldShowColNumbers,
  } = usePhonesTableLogic({
    columns,
    pageNumber,
    rowsPerPage,
    indexesOfFoundResultsForCurrentPage,
    departmentsAndSectionsPerPage,
    foundResults,
    indexDataOfFoundResultsForFoundResultsPage,
    headerRef,
    titleRef,
  });

  /* ===== HEADER ===== */
  const renderHeader = () => (
    <>
      <tr>
        <th rowSpan="2">№ п/п</th>

        {columns.map((col) =>
          col.key === "phones" ? (
            <th key={col.key} colSpan={col.subLabels.length}>
              {col.label}
            </th>
          ) : (
            <th key={col.key} rowSpan="2">
              {col.label}
            </th>
          )
        )}
      </tr>

      <tr>
        {columns
          .filter((c) => c.key === "phones")
          .flatMap((col) =>
            col.subLabels.map((sub) => (
              <th key={sub.key}>{sub.label}</th>
            ))
          )}
      </tr>
    </>
  );

  /* ===== ROW CELLS ===== */
  const renderRowCells = (row, index) => {
    const nonUserRowsBefore = countNonUserRowsBefore(pageData, index);

    const {
      dimAfterSearchNavigationClass,
      dimAfterPageNumberPressedClass,
    } = getDimGroupRowClasses({
      hasFoundResults: indexesOfFoundResultsForCurrentPage.length !== 0,
      showPreviousPageHighlight,
      isPagesNavbarLinkElementOnCurrentPagePressed,
      styles: s,
    });

    switch (row.type) {
      case "department":
        return (
          <td
            className={`${s.mainDepartment} ${dimAfterSearchNavigationClass} ${dimAfterPageNumberPressedClass}`}
            colSpan={columns.length + phoneColumns}
          >
            {row.departmentName}
          </td>
        );

      case "section":
        return (
          <td
            className={`${s.section} ${dimAfterSearchNavigationClass} ${dimAfterPageNumberPressedClass}`}
            colSpan={columns.length + phoneColumns}
          >
            {row.sectionName}
          </td>
        );

      case "user": {
        const userRowIndex = getUserRowIndex({
          pageNumber,
          rowsPerPage,
          index,
          nonUserRowsBefore,
          indexDecrementFromPreviousPages,
        });

        return (
          <>
            <td>{userRowIndex}</td>

            {row.userTypeId !== 1 ? (
              <>
                <td>{row.userName}</td>
                <td />
              </>
            ) : (
              <>
                <td>{row.userPosition}</td>
                <td>{row.userName}</td>
              </>
            )}

            {columns
              .find((c) => c.key === "phones")
              ?.subLabels.map((sub) => {
                const phone = row.phones?.find(
                  (p) => p.phoneType === sub.label
                );
                return <td key={sub.key}>{phone?.phoneName || ""}</td>;
              })}
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <TableWrapper
      pageData={pageData}
      showDigitsFromPressed={showDigitsFromPressed}
      shouldShowColNumbers={shouldShowColNumbers}
      colNumbersRef={colNumbersRef}
      headerRef={headerRef}
      indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
      showPreviousPageHighlight={showPreviousPageHighlight}
      isPagesNavbarLinkElementOnCurrentPagePressed={
        isPagesNavbarLinkElementOnCurrentPagePressed
      }
      renderIndexCell={renderIndexCell}
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
      rowRefs={rowRefs}
      indexDataOfFoundResultsForFoundResultsPage={
        indexDataOfFoundResultsForFoundResultsPage
      }
    />
  );
};

export default PhonesTable;
