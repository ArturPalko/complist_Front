import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";

import {
  countNonUserRowsBefore,
  getUserRowIndex,
} from "./phonesTableHelpers";


const BasePhonesTable = createTableComponent(usePhonesTableLogic);

const PhonesTable = ({
  columns,
  pageNumber,
  rowsPerPage,
}) => {
  // ===== Рендер шапки =====
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
            col.subLabels.map((sub) => <th key={sub.key}>{sub.label}</th>)
          )}
      </tr>
    </>
  );

  // ===== Рендер рядків =====
  const renderRowCells = (row, index, tableLogic) => {
    const nonUserRowsBefore = countNonUserRowsBefore(tableLogic.pageData, index);

    const { dimAfterSearchNavigationClass, dimAfterPageNumberPressedClass } = tableLogic.dimClasses;

    switch (row.type) {
      case "department":
      case "section": {
        const isDepartment = row.type === "department";

        return (
          <td
            className={`
              ${isDepartment ? s.mainDepartment : s.section}
              ${dimAfterSearchNavigationClass}
              ${dimAfterPageNumberPressedClass}
            `}
            colSpan={6}
          >
            {isDepartment ? row.departmentName : row.sectionName}
          </td>
        );
      }
      case "user": {
        const userRowIndex = getUserRowIndex({
          pageNumber,
          rowsPerPage,
          index,
          nonUserRowsBefore,
          indexDecrementFromPreviousPages: tableLogic.indexDecrementFromPreviousPages,
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
                const phone = row.phones?.find((p) => p.phoneType === sub.label);
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
    <BasePhonesTable
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default PhonesTable;
