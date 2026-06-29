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
            col.subLabels.map((sub, idx) => (
              <th key={sub.key ?? `${col.key}-${idx}`}>
                {sub.label}
              </th>
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

    const renderTd = (value, key = null, colSpan = 1) => (
      <TdWrapper
        key={key}
        value={value}
        tableUI={tableUI}
        colSpan={colSpan}
      >
        {value}
      </TdWrapper>
    );

    // =========================
    // PHONE MODE ROWS
    // =========================
    if (row.type === "phone") {
      const phoneRowIndex = getUserRowIndex({
        pageNumber,
        rowsPerPage,
        index,
        nonUserRowsBefore: 0,
        indexDecrementFromPreviousPages:
          tableLogic.indexDecrementFromPreviousPages,
      });
        debugger
      return (
        <>
          <td>{phoneRowIndex}</td>

          {renderTd(row.number, `phone-num-${row.id}`)}

          {renderTd(
            <div className={s.usersList}>
              {Array.isArray(row.users) && row.users.length > 0 ? (
                row.users.map((u) => (
                  <span
                    key={`user-${row.id}-${u.id}`}
                    className={s.userItem}
                  >
                    {u.name}
                  </span>
                ))
              ) : (
                <span className={s.emptyUsers}>—</span>
              )}
            </div>,
            `users-${row.id}`,
            4
          )}
        </>
      );
    }

    // =========================
    // GROUP ROWS
    // =========================
    if (row.type !== "user") {
      const config = entityMap[row.type];

      const name = config ? row[config.name] : row.name;

      const className = config?.className ? s[config.className] : "";

      const showBreak =
        row.type === "department"
          ? tableLogic.dashedBlocks.departments.includes(name)
          : tableLogic.dashedBlocks.sections.includes(name);

      const totalColumns =
        1 +
        columns.reduce((sum, col) => {
          return sum + (col.subLabels?.length || 1);
        }, 0);

      return (
        <TdWrapper
          showBreak={showBreak}
          value={name}
          tableUI={tableUI}
          colSpan={totalColumns}
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

    const userValues =
      row.userTypeId !== 1
        ? [row.userName, null]
        : [row.userPosition, row.userName];

    return (
      <>
        <td>{userRowIndex}</td>

        {userValues.map((value, i) =>
          value ? renderTd(value, `user-${row.id}-${i}`) : <td key={i} />
        )}

        {phoneColumn?.subLabels.map((sub, idx) => {
          const phone = row.phones?.find(
            (p) => p.phoneType === sub.key
          );

          const safeKey =
            sub.key ?? sub.label ?? `phone-col-${idx}`;

          return renderTd(
            phone?.phoneName || "",
            `phone-${row.id}-${safeKey}`
          );
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