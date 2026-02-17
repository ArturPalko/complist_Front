import React from "react";
import { useMailsTableLogic } from "../../redux/hooks/useMailsTableLogic";
import { createTableComponent } from "../CommonInjection/TableWrapper/tableFactory";
import s from "../../Components/PhonesTable/PhonesTable.module.css"; // свої стилі

// Створюємо базовий компонент через фабрику та передаємо свої стилі
const BaseMailsTable = createTableComponent(useMailsTableLogic, s);

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
