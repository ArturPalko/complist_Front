import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import s from "../PhonesTable/PhonesTable.module.css";
import d from "./DicitonaryTable.module.css"

import { GroupRowActions } from "../PhonesTable/GroupRowActions";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";

import {
  handleBack,
} from "../PhonesTable/phonesTableHelpers";

import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";
import { entityMap } from "../../../../configs/app/enitiyMap";
import { useCrudModalActions } from "../../../../redux/hooks/useCrudModalActions";

import {
  addUsersModeSelected,
  getCurrentMode,
  isDepartmentsMode,
  isEditModeSelected,
  isSectionsMode,
  selectActiveSectionId,
  selectActiveSectionName,
  selectAtiveDepartmentId,
  selectAtiveDepartmentName,
} from "../../../../redux/selectors/selector";

import { sortUsersActionCreator } from "../../../../redux/reducers/data-reducer/data-reducer";
import PhoneEditRow from "./subComponents/PhoneEditRow/PhoneEditRow";
import NavigationHeader from "./subComponents/NavigationHeader/NavigationHeader";

import { pageConfigs } from "../../../../configs/app/pageConfig";
import {
  Pages,
  PHONE_TYPES,
} from "../../../../configs/app/constants";

const BasePhonesTable =
  createTableComponent(usePhonesTableLogic);

const DictionaryTable = ({
  pageNumber,
  rowsPerPage,
  isSections,
}) => {
  const columns =
    pageConfigs[Pages.PHONES].columns;

  const modalType =
    useSelector(getCurrentMode);

  const { add } =
    useCrudModalActions(modalType);

  const dispatch = useDispatch();

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

  const isDepartmentMode = useSelector(
    isDepartmentsMode
  );

  const isPhoneEditMode =
    PHONE_TYPES.includes(viewMode);

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

  const currentMode =
    useSelector(getCurrentMode);

  const showNavigationHeader =
    activeDep != null ||
    activeSec != null;

  const totalColumns =
    1 +
    columns.reduce(
      (sum, col) =>
        sum +
        (col.subLabels?.length || 1),
      0
    );

  // =====================================================
  // USERS SORTING
  // =====================================================

  const [
    sortConfig,
    setSortConfig,
  ] = useState({
    key: null,
    direction: "asc",
  });

  const handleUserSort = (key) => {
    if (currentMode !== "users") {
      return;
    }

    const direction =
      sortConfig.key === key &&
      sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({
      key,
      direction,
    });

    dispatch(
      sortUsersActionCreator(
        key,
        direction
      )
    );
  };

  // =====================================================
  // SORT ARROW
  // =====================================================

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return (
      <span className={s.sortArrow}>
        {sortConfig.direction === "asc"
          ? "↑"
          : "↓"}
      </span>
    );
  };

  // =====================================================
  // HEADER
  // =====================================================

  const renderHeader = () => {
    // ===================================================
    // PHONE EDIT MODE
    // ===================================================

    if (isPhoneEditMode) {
      return (
        <tr>
          <th>№</th>
          <th>Номер телефону</th>
          <th>Абоненти</th>
        </tr>
      );
    }

    // ===================================================
    // USERS MODE
    // ===================================================

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
              {renderSortArrow(
                "userType"
              )}
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
              {renderSortArrow(
                "department"
              )}
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
        </tr>
      );
    }

    // ===================================================
    // OTHER DICTIONARY MODES
    // ===================================================

    if (
      currentMode &&
      isEdit &&
      !activeDep
    ) {
      return;
    }

    // ===================================================
    // NAVIGATION HEADER
    // ===================================================

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
            dispatch,
          })}
        />
      );
    }
  };

  // =====================================================
  // ROWS
  // =====================================================

  const renderRowCells = (
    row,
    index,
    tableLogic,
    tableUI
  ) => {
    const config = entityMap[row.type];

    const id = config
      ? row[config.id]
      : row.id;

    const dim =
      tableLogic.getRowDimClasses(id);

const renderTd = (
  value,
  key = null,
  colSpan = 1,
  className = ""
) => (
  <TdWrapper
    key={key}
    value={value}
    tableUI={tableUI}
    colSpan={colSpan}
    className={className}
  >
    {value}
  </TdWrapper>
);
// console.log("row:",row)
    // ===================================================
    // ADD USERS MODE
    // ===================================================
    debugger
    if (!row.type && activeDep) {
      debugger
  return (
    <>
      <td>{index + 1}</td>
      {renderTd(row.name, `name-${row.id}`)}
      {renderTd(row.positionName, `position-${row.id}`)}
      {renderTd(row.userType, `type-${row.id}`)}
    </>
  );
}
if (row.type === "user") {
  const isRegularUser =
    row.userType === "Користувач";

  return (
    <>
      <td>
        {(pageNumber - 1) *
          rowsPerPage +
          index +
          1}
      </td>

      {renderTd(
        row.name,
        `name-${row.id}`,
        1,
        isRegularUser
          ? ""
          : d.specialUserName
      )}

      {renderTd(
        row.userType,
        `userType-${row.id}`,
        1,
        isRegularUser
          ? ""
          : d.specialUserType
      )}

      {renderTd(
        row.department,
        `department-${row.id}`,
        1,
        d.userDepartment
      )}

      {renderTd(
        row.section,
        `section-${row.id}`,
        1,
        d.userSection
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
    // USER ROWS
    // ===================================================

if (row.type === "user") {
  return (
    <>
      <td>
        {(pageNumber - 1) *
          rowsPerPage +
          index +
          1}
      </td>

      {renderTd(
        row.name,
        `name-${row.id}`
      )}

      {renderTd(
        row.userType,
        `userType-${row.id}`
      )}

      {renderTd(
        row.department,
        `department-${row.id}`,
        1,
        d.userDepartment
      )}

      {renderTd(
        row.section,
        `section-${row.id}`,
        1,
        d.userSection
      )}
    </>
  );
}
    // ===================================================
    // GROUP ROWS
    // department / section / position / userType
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

              row.type === "department" &&
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
          colSpan={groupTotalColumns}
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