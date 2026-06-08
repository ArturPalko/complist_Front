import { useMailsTableLogic } from "../../../../redux/hooks/useMailsTableLogic";
import { createTableComponent } from "../../../../shared/components/table/TableWrapper/tableFactory";
import { TdWrapper } from "../../../../shared/components/TdWrapper/TdWrapper";

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
const renderRowCells = (
  item,
  index,
  tableLogic,
  tableUI,
  tableDrag
) => (
  <>
  
<td>
  {(pageNumber - 1) * rowsPerPage + index + 1}
</td>
    {columns.map((col) => (
      <TdWrapper
        key={col.key}
        cellKey={col.key}
        rowId={item.id}
        value={item[col.key]}
        tableUI={tableUI}
      >
        {item[col.key]}
      </TdWrapper>
    ))}

    {showPasswords && (
      <TdWrapper
        cellKey="password"
        rowId={item.id}
        value={passwordsMap[item.id] || "—"}
        tableUI={tableUI}
      >
        {passwordsMap[item.id] || "—"}
      </TdWrapper>
    )}
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
