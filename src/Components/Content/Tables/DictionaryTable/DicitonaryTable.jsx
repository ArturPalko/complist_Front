import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";

import { useDictionaryTableLogic } from "../../../../redux/hooks/useDictionaryTableLogic";



import { handleBack } from "./subComponents/subRows/GroupRows/GroupRowActions/helepers";
import { entityMap } from "../../../../configs/app/enitiyMap";

import NavigationHeader from "./subComponents/subHeaders/NavigationHeader/NavigationHeader";
import UsersTableHeader from "./subComponents/subHeaders/UsersTableHeader/UsersTableHeader";
import PhoneEditHeader from "./subComponents/subHeaders/PhoneEditHeader/PhoneEditHeader";

import PhoneEditRow from "./subComponents/subRows/PhoneEditRow/PhoneEditRow";
import AddUsersRow from "./subComponents/subRows/AddUserRow/AddUserRow";
import UsersRow from "./subComponents/subRows/UsersRow/UserRow";
import GroupRow from "./subComponents/subRows/GroupRows/GroupRows";

const BaseDictionaryTable =
  createTableComponent(
    useDictionaryTableLogic
  );

const DictionaryTable = ({
  pageNumber,
  rowsPerPage,
}) => {


  // =====================================================
  // HEADER
  // =====================================================

  const renderHeader = (
    tableLogic,
    tableUI
  ) => {
    const {
      isPhoneEditMode,
      currentMode,
      isEdit,
      activeDep,
      activeSec,
      departmentName,
      sectionName,
      showNavigationHeader,
      sortConfig,
      handleUserSort,
      isAddUsers,
    } = tableLogic;

    const {
      isSections,
      dispatch,
    } = tableUI;

    if (isPhoneEditMode) {
      return <PhoneEditHeader />;
    }

    if (currentMode === "users") {
      return (
        <UsersTableHeader
          sortConfig={sortConfig}
          onSort={handleUserSort}
        />
      );
    }

    if (
      currentMode &&
      isEdit &&
      !activeDep
    ) {
      return null;
    }

    if (showNavigationHeader) {
      return (
        <NavigationHeader
          departmentName={departmentName}
          sectionName={sectionName}
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

    return null;
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
    const {
      isPhoneEditMode,
      isAddUsers,
      activeDep,
    } = tableLogic;

    const {
      isSections,
    } = tableUI;

    const config =
      entityMap[row.type];

    const id = config
      ? row[config.id]
      : row.id;

    const dim =
      tableLogic.getRowDimClasses(id);

    // -----------------------------------------------------
    // ADD USERS
    // -----------------------------------------------------

    if (
      !row.type &&
      activeDep
    ) {
      return (
        <AddUsersRow
          row={row}
          index={index}
          tableUI={tableUI}
        />
      );
    }

    // -----------------------------------------------------
    // USER
    // -----------------------------------------------------

    if (row.type === "user") {
      return (
        <UsersRow
          row={row}
          index={index}
          pageNumber={pageNumber}
          rowsPerPage={rowsPerPage}
          tableUI={tableUI}
          dim={dim}
        />
      );
    }

    // -----------------------------------------------------
    // PHONE EDIT
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // GROUP ROW
    // -----------------------------------------------------

    if (row.type !== "user") {
      return (
        <GroupRow
          row={row}
          tableLogic={tableLogic}
          tableUI={tableUI}
      
          isSections={isSections}
          isAddUsers={isAddUsers}
          dim={dim}
        />
      );
    }

    return null;
  };

  // =====================================================
  // TABLE
  // =====================================================

  return (
    <BaseDictionaryTable
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default DictionaryTable;