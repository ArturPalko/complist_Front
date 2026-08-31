import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import {
  countNonUserRowsBefore,
  getUserRowIndex,
} from "./phonesTableHelpers";
import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";

const BasePhonesTable =
  createTableComponent(usePhonesTableLogic);

const PhonesTable = ({
  columns,
  pageNumber,
  rowsPerPage,
}) => {
  const renderHeader = () => (
    <>
      <tr>
        <th rowSpan="2">№ п/п</th>

        {columns.map((col) =>
          col.key === "phones" ? (
            <th
              key={col.key}
              colSpan={col.subLabels.length}
            >
              {col.label}
            </th>
          ) : (
            <th
              key={col.key}
              rowSpan="2"
            >
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
              <th key={sub.key}>
                {sub.label}
              </th>
            ))
          )}
      </tr>
    </>
  );

  const renderRowCells = (
    row,
    index,
    tableLogic,
    tableUI
  ) => {
    const nonUserRowsBefore =
      countNonUserRowsBefore(
        tableLogic.pageData,
        index
      );

    const dim =
      tableLogic.getRowDimClasses(
        row.dimKey
      );

    switch (row.type) {
      case "department":
      case "section": {
        const isDepartment =
          row.type === "department";

        const name = isDepartment
          ? row.departmentName
          : row.sectionName;

        const className = isDepartment
          ? s.mainDepartment
          : s.section;

        const showBreak = isDepartment
          ? tableLogic.dashedBlocks.departments.some(
              (d) => d === name
            )
          : tableLogic.dashedBlocks.sections.includes(
              name
            );

        return (
          <TdWrapper
            showBreak={showBreak}
            value={name}
            tableUI={tableUI}
            colSpan={6}
            isHeaderRow={true}
            className={[
              className,
              dim.hidden
                ? ""
                : dim.dimAfterSearchNavigationClass,
              dim.hidden
                ? ""
                : dim.dimAfterPageNumberPressedClass,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {name}
          </TdWrapper>
        );
      }

      case "user": {
        const userRowIndex =
          getUserRowIndex({
            pageNumber,
            rowsPerPage,
            index,
            nonUserRowsBefore,
            indexDecrementFromPreviousPages:
              tableLogic.indexDecrementFromPreviousPages,
          });

        const userName =
          row.userName?.trim() || "";

        const isRegularUser =
          row.userType === "Користувач";

        let displayPosition = "";
        let displayName = "";

        if (isRegularUser) {
          // Звичайний користувач:
          // Посада -> positionName
          // Ім'я -> userName
          displayPosition =
            row.userPosition || "";

          displayName = userName;
        } else {
          // Не "Користувач":
          // Ім'я -> завжди порожнє
          // Посада -> name, якщо він є,
          //           інакше userType
          displayName = "";

          displayPosition =
            userName || row.userType || "";
        }

        return (
          <>
            <td>{userRowIndex}</td>

            <TdWrapper
              value={displayPosition}
              tableUI={tableUI}
            >
              {displayPosition}
            </TdWrapper>

            <TdWrapper
              value={displayName}
              tableUI={tableUI}
            >
              {displayName}
            </TdWrapper>

            {columns
              .find(
                (c) => c.key === "phones"
              )
              ?.subLabels.map((sub) => {
                const phone =
                  row.phones?.find(
                    (p) =>
                      p.phoneType ===
                      sub.label
                  );

                const phoneValue =
                  phone?.phoneName || "";

                return (
                  <TdWrapper
                    key={sub.key}
                    value={phoneValue}
                    tableUI={tableUI}
                  >
                    {phoneValue}
                  </TdWrapper>
                );
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
