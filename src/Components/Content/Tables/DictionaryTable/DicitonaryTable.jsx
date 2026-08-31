import { useSelector } from "react-redux";

import s from "../PhonesTable/PhonesTable.module.css";
import d from "./DicitonaryTable.module.css";

import { GroupRowActions } from "../PhonesTable/GroupRowActions";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";

import { handleBack } from "../PhonesTable/phonesTableHelpers";

import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";
import { entityMap } from "../../../../configs/app/enitiyMap";

import {
  addUsersModeSelected,
  getCurrentMode,
  isEditModeSelected,
  selectActiveSectionId,
  selectActiveSectionName,
  selectAtiveDepartmentId,
  selectAtiveDepartmentName,
} from "../../../../redux/selectors/selector";

import PhoneEditRow from "./subComponents/PhoneEditRow/PhoneEditRow";
import NavigationHeader from "./subComponents/NavigationHeader/NavigationHeader";

import { pageConfigs } from "../../../../configs/app/pageConfig";
import {
  Pages,
  PHONE_TYPES,
} from "../../../../configs/app/constants";

import { useUsersModeSorting } from "../../../../redux/hooks/useUsersModeSorting";

const BasePhonesTable =
  createTableComponent(usePhonesTableLogic);

const DictionaryTable = ({
  pageNumber,
  rowsPerPage,
  isSections,
}) => {
  // =====================================================
  // CONFIG
  // =====================================================

  const columns =
    pageConfigs[Pages.PHONES].columns;

  // =====================================================
  // REDUX
  // =====================================================

  const currentMode =
    useSelector(getCurrentMode);

  const viewMode = useSelector(
    (state) => state.ui.viewMode
  );

  const isAddUsers = useSelector(
    addUsersModeSelected
  );

  const activeDep = useSelector(
    selectAtiveDepartmentId
  );

  const activeSec = useSelector(
    selectActiveSectionId
  );

  const departmentNameForCapture =
    useSelector(
      selectAtiveDepartmentName
    );

  const sectionNameForCapture =
    useSelector(
      selectActiveSectionName
    );

  const isEdit = useSelector(
    isEditModeSelected
  );

  // =====================================================
  // MODES
  // =====================================================

  const isPhoneEditMode =
    PHONE_TYPES.includes(viewMode);

  const showNavigationHeader =
    activeDep != null ||
    activeSec != null;

  // =====================================================
  // USERS SORTING
  // =====================================================

  const {
    handleUserSort,
    renderSortArrow,
  } = useUsersModeSorting(currentMode);

  // =====================================================
  // TABLE CONFIG
  // =====================================================

  const totalColumns =
    1 +
    columns.reduce(
      (sum, col) =>
        sum +
        (col.subLabels?.length || 1),
      0
    );

  // =====================================================
  // HEADER
  // =====================================================

  const renderHeader = () => {
    // -----------------------------------------------------
    // PHONE EDIT MODE
    // -----------------------------------------------------

    if (isPhoneEditMode) {
      return (
        <tr>
          <th>№</th>
          <th>Номер телефону</th>
          <th>Абоненти</th>
        </tr>
      );
    }

    // -----------------------------------------------------
    // USERS MODE
    // -----------------------------------------------------

    if (currentMode === "users") {
      return (
        <tr>
          <th>№</th>

          <th
            className={s.sortableHeader}
            onClick={() =>
              handleUserSort("name")
            }
          >
            <span>
              Користувач{" "}
              {renderSortArrow("name")}
            </span>
          </th>

          <th
            className={s.sortableHeader}
            onClick={() =>
              handleUserSort("userType")
            }
          >
            <span>
              Тип користувача{" "}
              {renderSortArrow("userType")}
            </span>
          </th>

          <th
            className={s.sortableHeader}
            onClick={() =>
              handleUserSort("department")
            }
          >
            <span>
              Департамент{" "}
              {renderSortArrow("department")}
            </span>
          </th>

          <th
            className={s.sortableHeader}
            onClick={() =>
              handleUserSort("section")
            }
          >
            <span>
              Секція{" "}
              {renderSortArrow("section")}
            </span>
          </th>

          <th
            className={s.sortableHeader}
            onClick={() =>
              handleUserSort("isActive")
            }
          >
            <span>
              Статус{" "}
              {renderSortArrow("isActive")}
            </span>
          </th>
        </tr>
      );
    }

    // -----------------------------------------------------
    // EDIT MODE
    // -----------------------------------------------------

    if (
      currentMode &&
      isEdit &&
      !activeDep
    ) {
      return;
    }

    // -----------------------------------------------------
    // NAVIGATION HEADER
    // -----------------------------------------------------

    if (showNavigationHeader) {
      return (
        <NavigationHeader
          totalColumns={totalColumns}
          departmentName={
            departmentNameForCapture
          }
          sectionName={
            sectionNameForCapture
          }
          showSection={!!activeSec}
          onBack={handleBack({
            activeDep,
            activeSec,
            isSections,
            isAddUsers,
            dispatch: null,
          })}
        />
      );
    }
  };

  // =====================================================
  // ROW CELLS
  // =====================================================

  const renderRowCells = (
    row,
    index,
    tableLogic,
    tableUI
  ) => {
    const config =
      entityMap[row.type];

    const id = config
      ? row[config.id]
      : row.id;

    const dim =
      tableLogic.getRowDimClasses(id);

    // ===================================================
    // TD HELPER
    // ===================================================

    const renderTd = (
      value,
      key = null,
      colSpan = 1,
      className = "",
      inactive = false
    ) => (
      <TdWrapper
        key={key}
        value={value}
        tableUI={tableUI}
        colSpan={colSpan}
        className={className}
        inactive={inactive}
      >
        {value}
      </TdWrapper>
    );

    // ===================================================
    // ADD USERS MODE
    // ===================================================

    if (!row.type && activeDep) {
      const inactive = !row.isActive;

      return (
        <>
          <td
            className={
              inactive
                ? s.inactive
                : ""
            }
          >
            {index + 1}
          </td>

          {renderTd(
            row.name,
            `name-${row.id}`,
            1,
            "",
            inactive
          )}

          {renderTd(
            row.positionName,
            `position-${row.id}`,
            1,
            "",
            inactive
          )}

          {renderTd(
            row.userType,
            `type-${row.id}`,
            1,
            "",
            inactive
          )}
        </>
      );
    }

    // ===================================================
    // USER ROW
    // ===================================================

    if (row.type === "user") {
      const inactive = !row.isActive;

      return (
        <>
          <TdWrapper
            value={
              (pageNumber - 1) *
                rowsPerPage +
              index +
              1
            }
            tableUI={tableUI}
            inactive={inactive}
          >
            {(pageNumber - 1) *
              rowsPerPage +
              index +
              1}
          </TdWrapper>

          {renderTd(
            row.name,
            `name-${row.id}`,
            1,
            "",
            inactive
          )}

          {renderTd(
            row.userType,
            `userType-${row.id}`,
            1,
            "",
            inactive
          )}

          {renderTd(
            row.department,
            `department-${row.id}`,
            1,
            d.userDepartment,
            inactive
          )}

          {renderTd(
            row.section,
            `section-${row.id}`,
            1,
            d.userSection,
            inactive
          )}

          {renderTd(
            row.isActive
              ? "Активний"
              : "Неактивний",
            `status-${row.id}`,
            1,
            "",
            inactive
          )}
        </>
      );
    }

    // ===================================================
    // PHONE EDIT MODE
    // ===================================================

    if (
      isPhoneEditMode &&
      row.type === "phone"
    ) {
      return (
        <PhoneEditRow
          row={row}
          index={index}
          pageNumber={pageNumber}
          rowsPerPage={rowsPerPage}
          tableLogic={tableLogic}
          tableUI={tableUI}
        />
      );
    }

    // ===================================================
    // GROUP ROWS
    // ===================================================

    if (row.type !== "user") {
      const config =
        entityMap[row.type];

      const name = config
        ? row[config.name]
        : row.name;

      const className =
        config?.className
          ? [
              s[config.className],

              row.type ===
                "department" &&
              !row.presentedOnPhonesPage
                ? s.notPresentedOnPhonesPage
                : "",
            ]
              .filter(Boolean)
              .join(" ")
          : "";

      const showBreak =
        row.type === "department"
          ? tableLogic.dashedBlocks.departments.includes(
              name
            ) &&
            !isSections &&
            !isAddUsers
          : tableLogic.dashedBlocks.sections.includes(
              name
            ) &&
            !isAddUsers;

      const groupTotalColumns =
        1 +
        columns.reduce(
          (sum, col) =>
            sum +
            (col.subLabels?.length ||
              1),
          0
        );

      return (
        <TdWrapper
          showBreak={showBreak}
          value={name}
          tableUI={tableUI}
          colSpan={
            groupTotalColumns
          }
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
          <div
            className={
              s.groupRowContent
            }
          >
            <span>{name}</span>

            <GroupRowActions
              row={row}
              isSections={isSections}
              isAddUsers={isAddUsers}
            />
          </div>
        </TdWrapper>
      );
    }

    return null;
  };

  // =====================================================
  // TABLE
  // =====================================================

  return (
    <BasePhonesTable
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default DictionaryTable;