import s from "../PhonesTable/PhonesTable.module.css";
 
import { GroupRowActions } from "../PhonesTable/GroupRowActions";
import { usePhonesTableLogic } from "../../../../redux/hooks/usePhonesTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import {
  countNonUserRowsBefore,
  getUserRowIndex,
  handleOnOpenSectionsButtonClick,
  handleBack,
  hasItems,
  getItemsCount,
  shouldShowActionButton,
} from "../PhonesTable/phonesTableHelpers";
import { useDispatch, useSelector } from "react-redux";
import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";
import { entityMap } from "../../../../configs/app/enitiyMap";
import { useCrudModalActions } from "../../../../redux/hooks/useCrudModalActions";
import { addUsersModeSelected, getCurrentMode, isDepartmentsMode, isEditModeSelected, isSectionsMode, selectActiveSectionId, selectActiveSectionName, selectAtiveDepartmentId, selectAtiveDepartmentName, selectUsersByDepartment } from "../../../../redux/selectors/selector";
import PhoneEditRow from "./subComponents/PhoneEditRow/PhoneEditRow";
import NavigationHeader from "./subComponents/NavigationHeader/NavigationHeader";
import { pageComponents } from "../../../../configs/app/pageComponent";
import { pageConfigs } from "../../../../configs/app/pageConfig";
import { Pages } from "../../../../configs/app/constants";

const BasePhonesTable = createTableComponent(usePhonesTableLogic);

export const PHONE_TYPES = ["landline", "internal", "cisco"];

 const DictionaryTable = ({
//   columns,
  pageNumber,
  rowsPerPage,
  isSections,
}) => { 
    
 const columns = pageConfigs[Pages.PHONES].columns;
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
const isEdit = useSelector(isEditModeSelected);
const currentMode = useSelector(getCurrentMode);


const showNavigationHeader =
  activeDep != null || activeSec != null;
const headerTitle = activeSec
  ? `${departmentNameForCapture} / ${sectionNameForCapture}`
  : departmentNameForCapture;
const totalColumns =
  1 + columns.reduce((sum, col) => sum + (col.subLabels?.length || 1), 0);

const renderHeader = () => {
    
  if (currentMode && isEdit && !isPhoneEditMode && !activeDep) return
  
  if (isPhoneEditMode) {
  return (
    <tr>
      <th>№</th>
      <th>Номер телефону</th>
      <th>Абоненти</th>
    </tr>
  );
}

if (showNavigationHeader) {
  return (
    <NavigationHeader
      totalColumns={totalColumns}
      departmentName={departmentNameForCapture}
      sectionName={sectionNameForCapture}
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

  // =========================
  // ROWS
  // =========================
  
  const renderRowCells = (row, index, tableLogic, tableUI) => {
    const config = entityMap[row.type];

const id = config
  ? row[config.id]
  : row.id;
    const dim = tableLogic.getRowDimClasses(id);
    const phoneColumn = columns.find((c) => c.key === "phones");
  // console.log("DICTIONARY ROW DIM:", {
  //   row,
  //   dimKey: row.dimKey,
  //   dim,
  //   isPressed: tableUI?.isPressed,
  // });
  console.log("=== DICTIONARY DIM KEY ===", {
  row,
  rowId: row.id,
  rowType: row.type,
  dimKey: row.dimKey,
});
//       
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
  if (isPhoneEditMode && row.type === "phone") {
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

  <GroupRowActions
    row={row}
    isSections={isSections}
    isAddUsers={isAddUsers}
  />
</div>
</TdWrapper>
      );
    }
    
  };

  return (
    <BasePhonesTable
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default DictionaryTable;




