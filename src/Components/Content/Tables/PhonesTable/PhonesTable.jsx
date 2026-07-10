import s from "./PhonesTable.module.css";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import {
  countNonUserRowsBefore,
  getUserRowIndex,
  handleOnOpenSectionsButtonClick,
  handleBack
} from "./phonesTableHelpers";
import { useDispatch, useSelector } from "react-redux";
import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";
import { entityMap } from "../../../../configs/app/enitiyMap";
import { useCrudModalActions } from "../../../../redux/hooks/useCrudModalActions";
import { addUsersModeSelected, getCurrentMode, isDepartmentsMode, isSectionsMode, selectActiveSectionId, selectActiveSectionName, selectAtiveDepartmentId, selectAtiveDepartmentName, selectUsersByDepartment } from "../../../../redux/selectors/selector";

const BasePhonesTable = createTableComponent(usePhonesTableLogic);

const PHONE_TYPES = ["landline", "internal", "cisco"];

const PhonesTable = ({
  columns,
  pageNumber,
  rowsPerPage,
  isSections,
}) => {
  const modalType = useSelector(getCurrentMode)
  const { add} = useCrudModalActions(modalType);
  const dispatch = useDispatch();
  const viewMode = useSelector((state) => state.ui.viewMode);
  const isAddUsers = useSelector (addUsersModeSelected);
  const activeDep = useSelector(selectAtiveDepartmentId);
  const activeSec = useSelector(selectActiveSectionId)
  const users = useSelector(selectUsersByDepartment(activeDep))
  const isDepartmentMode = useSelector(isDepartmentsMode)
  const isPhoneEditMode = PHONE_TYPES.includes(viewMode);
  const rowTypesForBtn= ["department", "section"]
  const departmentNameForCapture = useSelector(selectAtiveDepartmentName);
const sectionNameForCapture = useSelector(selectActiveSectionName);

// console.log ("users:", users)
// console.log ("2222222222:")
  // =========================
  // HEADER
  // =========================

const hasItems = (row) => {
  if (row.type === "department") {
    return isAddUsers
      ? Array.isArray(row.users) && row.users.length > 0
      : Array.isArray(row.sections) && row.sections.length > 0;
  }
  if (row.type == "section") {
    
    return    Array.isArray(row.users) && row.users.length > 0 
  }

  if (row.type === "section") {
    return (
      isAddUsers &&
      Array.isArray(row.users) &&
      row.users.length > 0
    );
  }

  return false;
};

const itemsCount = (row) => {
  if (row.type === "department") {
    return isAddUsers
      ? row.users?.length ?? 0
      : row.sections?.length ?? 0;
  }

  if (row.type === "section") {
    return isAddUsers
      ? row.users?.length ?? 0
      : 0;
  }

  return 0;
};

const showActionButton = (row) => {
  if (row.type === "department") {
    return isSections || isAddUsers;
  }

  if (row.type === "section") {
    return isAddUsers;
  }

  return false;
};
const showNavigationHeader =
  activeDep != null || activeSec != null;
const headerTitle = activeSec
  ? `${departmentNameForCapture} / ${sectionNameForCapture}`
  : departmentNameForCapture;
const totalColumns =
  1 + columns.reduce((sum, col) => sum + (col.subLabels?.length || 1), 0);

const renderHeader = () => {
  if (showNavigationHeader) {
    return (
      <tr>
        <th
          colSpan={totalColumns}
          className={s.navigationHeader}
        >
          <div className={s.navigationContent}>
            <button
              type="button"
              className={s.backButton}
              onClick={handleBack({
                activeDep,
                activeSec,
                isSections,
                isAddUsers,
                dispatch,
              })}
            >
              ← Назад
            </button>

            <div className={s.navigationTitle}>
              <span className={s.departmentTitle}>
                {departmentNameForCapture}
              </span>

              {activeSec && (
                <>
                  <span className={s.navigationSlash}>
                    {" / "}
                  </span>

                  <span className={s.sectionTitle}>
                    {sectionNameForCapture}
                  </span>
                </>
              )}
            </div>
          </div>
        </th>
      </tr>
    );
  }

  return (
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
            <th key={col.key} rowSpan="2">
              {col.label}
            </th>
          )
        )}
      </tr>

      <tr>
        {columns
          .filter((c) => c.key === "phones")
          .flatMap((col, idx) =>
            col.subLabels.map((sub) => (
              <th key={sub.key ?? `${col.key}-${idx}`}>
                {sub.label}
              </th>
            ))
          )}
      </tr>
    </>
  );
};

  // =========================
  // ROWS
  // =========================
  const renderRowCells = (row, index, tableLogic, tableUI) => {
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
if (((activeDep && isDepartmentMode) || (activeSec && isSectionsMode)) && isAddUsers) {
  return (
    <>
      <td>{index + 1}</td>

      {renderTd(row.name, `name-${row.id}`)}
      {renderTd(row.positionName, `position-${row.id}`)}
      {renderTd(row.userType, `type-${row.id}`)}
      
    </>
  );
}
    // =====================================================
    // 📞 PHONE EDIT MODE (NEW UI)
    // =====================================================
    if (isPhoneEditMode && row.type === "phone") {
      const phoneRowIndex = getUserRowIndex({
        pageNumber,
        rowsPerPage,
        index,
        nonUserRowsBefore: 0,
        indexDecrementFromPreviousPages:
          tableLogic.indexDecrementFromPreviousPages,
      });

      return (
        <>
          {/* index */}
          <td>{phoneRowIndex}</td>

          {/* phone number */}
          {renderTd(row.number, `phone-num-${row.id}`)}

          {/* users (🔥 enhanced UI) */}
         {renderTd(
  <div className={s.usersInline}>
    {row.users?.length ? (
      row.users.map((u) => (
        <span key={u.id} className={s.userChip}>
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

    // =====================================================
    // GROUP ROWS (department / section / position)
    // =====================================================
    if (row.type !== "user") {
      const config = entityMap[row.type];
      const name = config ? row[config.name] : row.name;
      const className = config?.className ? s[config.className] : "";

      const showBreak =
        row.type === "department"
          ? tableLogic.dashedBlocks.departments.includes(name) && !isSections && !isAddUsers
          : tableLogic.dashedBlocks.sections.includes(name) && !isAddUsers;

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

    {showActionButton(row) && (
      <div className={s.groupRowActions}>
        {hasItems(row) ? (
          <>
            <span className={s.sectionsCount}>
              ({itemsCount(row)})
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOnOpenSectionsButtonClick({
                  rowType:row.type,
                  isSections,
                  isAddUsers,
                  item: row,
                  dispatch,
                })(e);
              }}
            >
              Переглянути
            </button>
          </>
        ) : (
          <button
            className={s.addButton}
            onClick={(e) => {
              e.stopPropagation();
              handleOnOpenSectionsButtonClick({
                isSections,
                isAddUsers,
                item: row,
                dispatch,
              })(e);

              add();
            }}
          >
            + Додати
          </button>
        )}
      </div>
    )}
  </div>
</TdWrapper>
      );
    }

    // =====================================================
    // USER ROW (NORMAL MODE)
    // =====================================================
    const nonUserRowsBefore = countNonUserRowsBefore(
      tableLogic.pageData,
      index
    );

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
            (p) => p.phoneType === sub.label
          );

          return renderTd(
            phone?.phoneName || "",
            `phone-${row.id}-${idx}`
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




