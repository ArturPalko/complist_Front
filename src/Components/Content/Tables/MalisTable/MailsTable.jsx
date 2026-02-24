import { useMailsTableLogic } from "../../../../redux/hooks/useMailsTableLogic";
import { createTableComponent } from "../../../../Components/infrastructure/components/table/TableWrapper/tableFactory";

const BaseMailsTable = createTableComponent(useMailsTableLogic);

const MailsTable = ({
  columns,
  showPasswords,
  passwordsMap,
  rowsPerPage,
  pageNumber,
}) => {

  // ===== Рендер шапки =====
  const renderHeader = () => (
    <tr>
      <th>№ п/п</th>
      {columns.map((col) => (
        <th key={col.key}>{col.label}</th>
      ))}
      {showPasswords && <th>Пароль</th>}
    </tr>
  );

  // ===== Рендер рядків =====
  const renderRowCells = (item, index) => (
    <>
      <td>{(pageNumber - 1) * rowsPerPage + index + 1}</td>
      {columns.map((col) => (
        <td key={col.key}>{item[col.key]}</td>
      ))}
      {showPasswords && <td>{passwordsMap[item.id] || "—"}</td>}
    </>
  );

  return (
    <BaseMailsTable
      showPasswords={showPasswords}
      passwordsMap={passwordsMap}
      renderHeader={renderHeader}
      renderRowCells={renderRowCells}
    />
  );
};

export default MailsTable;
