import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import {
  countNonUserRowsBefore,
  getUserRowIndex,
  handleOnOpenSectionsButtonClick,
} from "./phonesTableHelpers";
import { useDispatch } from "react-redux";
import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";
import { entityMap } from "../../../../configs/app/enitiyMap";

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

    const dim = tableLogic.getRowDimClasses(row.dimKey);

    const phoneColumn = columns.find((c) => c.key === "phones");
    const userValues =
        row.userTypeId !== 1
          ? [row.userName, null]
          : [row.userPosition, row.userName];

    // =========================
    // helper (ОДНА ТОЧКА TdWrapper)
    // =========================
    const renderTd = (value, key = null) => (
      <TdWrapper key={key} value={value} tableUI={tableUI}>
        {value}
      </TdWrapper>
    );

    // =========================
    // GROUP ROWS
    // =========================
    if (row.type !== "user") {
      const config = entityMap[row.type];

      const name = config ? row[config.name] : row.name;
      const id = config ? row[config.id] : row.id;

      const className = config?.className
        ? s[config.className]
        : "";

      const showBreak =
        row.type === "department"
          ? tableLogic.dashedBlocks.departments.includes(name)
          : tableLogic.dashedBlocks.sections.includes(name);

      return (
        <TdWrapper
          showBreak={showBreak}
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
    const userRowIndex = getUserRowIndex({
      pageNumber,
      rowsPerPage,
      index,
      nonUserRowsBefore,
      indexDecrementFromPreviousPages:
        tableLogic.indexDecrementFromPreviousPages,
    });

    return (
    <>
      <td>{userRowIndex}</td>

      {userValues.map((value, i) =>
        value ? renderTd(value, i) : <td key={i} />
      )}

      {phoneColumn?.subLabels.map((sub) => {
        const phone = row.phones?.find(
          (p) => p.phoneType === sub.label
        );

        return renderTd(phone?.phoneName || "", sub.key);
      })}
    </>
    );
  };

  return (
    <BasePhonesTable
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default PhonesTable;