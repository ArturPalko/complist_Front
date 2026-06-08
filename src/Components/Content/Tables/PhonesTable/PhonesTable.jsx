import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import {
  countNonUserRowsBefore,
  getUserRowIndex,
  handleOnOpenSectionsButtonClick,
} from "./phonesTableHelpers";
import torn_pageImg from "../../../../assets/Img/torn_page.png";
import { useDispatch } from "react-redux";
import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";

const BasePhonesTable = createTableComponent(usePhonesTableLogic);

const PhonesTable = ({
  columns,
  pageNumber,
  rowsPerPage,
  isSections,
}) => {
  const dispatch = useDispatch();

  // =========================
  // HEADER
  // =========================
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

  // =========================
  // ROWS
  // =========================
  const renderRowCells = (
    row,
    index,
    tableLogic,
    tableUI
  ) => {
    const nonUserRowsBefore = countNonUserRowsBefore(
      tableLogic.pageData,
      index
    );

    const idMap = {
      department: "departmentId",
      section: "sectionId",
      position: "id",
      userType: "id",
    };

    const idKey = idMap[row.type];
    const dim = tableLogic.getRowDimClasses(row[idKey]);

    switch (row.type) {
      // =========================
      // GROUP ROWS
      // =========================
      case "userType":
      case "position":
      case "department":
      case "section": {
        const isDepartment = row.type === "department";
        const isSection = row.type === "section";
        const isPosition = row.type === "position";
        const isUserType = row.type === "userType";

        const name = isDepartment
          ? row.departmentName
          : isSection
          ? row.sectionName
          : isPosition
          ? row.positionName
          : isUserType
          ? row.userType
          : row.name;

        const className = isDepartment
          ? s.mainDepartment
          : isPosition || isUserType
          ? s.positionsAndUserTypes
          : s.section;

        const showBreak = isDepartment
          ? tableLogic.dashedBlocks.departments.some(
              (d) => d === name
            )
          : tableLogic.dashedBlocks.sections.includes(name);

        return (
      <TdWrapper
  value={name}
  tableUI={tableUI}
  colSpan={6}
  isHeaderRow={true}
  className={[
    className,
    dim.hidden ? "" : dim.dimAfterSearchNavigationClass,
    dim.hidden ? "" : dim.dimAfterPageNumberPressedClass,
  ]
    .filter(Boolean)
    .join(" ")}
>
  <div className={s.groupRowContent}>
    <span>{name}</span>

    {isSections &&
      Array.isArray(row.sections) &&
      row.sections.length > 0 && (
        <div className={s.groupRowActions}>
          <span className={s.sectionsCount}>
            ({row.sections.length})
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOnOpenSectionsButtonClick({
                isSections,
                item: row,
                dispatch,
              })(e);
            }}
          >
            Переглянути
          </button>
        </div>
      )}
  </div>
</TdWrapper>
        );
      }

      // =========================
      // USER ROW
      // =========================
      case "user": {
        const userRowIndex = getUserRowIndex({
          pageNumber,
          rowsPerPage,
          index,
          nonUserRowsBefore,
          indexDecrementFromPreviousPages:
            tableLogic.indexDecrementFromPreviousPages,
        });

        const phoneColumn = columns.find(
          (c) => c.key === "phones"
        );

        return (
          <>
            {/* INDEX (NO COPY) */}
            <td>{userRowIndex}</td>

            {/* USER FIELDS */}
            {row.userTypeId !== 1 ? (
              <>
                <TdWrapper
                  value={row.userName}
                  tableUI={tableUI}
                >
                  {row.userName}
                </TdWrapper>

                <td />
              </>
            ) : (
              <>
                <TdWrapper
                  value={row.userPosition}
                  tableUI={tableUI}
                >
                  {row.userPosition}
                </TdWrapper>

                <TdWrapper
                  value={row.userName}
                  tableUI={tableUI}
                >
                  {row.userName}
                </TdWrapper>
              </>
            )}

            {/* PHONES */}
            {phoneColumn?.subLabels.map((sub) => {
              const phone = row.phones?.find(
                (p) => p.phoneType === sub.label
              );

              const value = phone?.phoneName || "";

              return (
                <TdWrapper
                  key={sub.key}
                  value={value}
                  tableUI={tableUI}
                >
                  {value}
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