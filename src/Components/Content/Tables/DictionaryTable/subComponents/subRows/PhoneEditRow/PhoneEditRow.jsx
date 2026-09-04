import s from "./PhoneEditRow.module.css";
import { TdWrapper } from "../../../../../../../shared/components/TdWrapper/TdWrapper";
import { getUserRowIndex } from "../../../../PhonesTable/phonesTableHelpers";

export const PhoneEditRow = ({
  row,
  index,
  pageNumber,
  rowsPerPage,
  tableLogic,
  tableUI,
}) => {
  const phoneRowIndex = getUserRowIndex({
    pageNumber,
    rowsPerPage,
    index,
    nonUserRowsBefore: 0,
    indexDecrementFromPreviousPages:
      tableLogic.indexDecrementFromPreviousPages,
  });

  const renderTd = (
    content,
    copyValue = content,
    key = null,
    colSpan = 1
  ) => (
    <TdWrapper
      key={key}
      value={copyValue}
      tableUI={tableUI}
      colSpan={colSpan}
    >
      {content}
    </TdWrapper>
  );

  const usersCopyValue =
    row.users?.map((u) => u.name).join(", ") || "";

  return (
    <>
      <td>{phoneRowIndex}</td>

      {renderTd(
        row.number,
        row.number,
        `phone-num-${row.id}`
      )}

      {renderTd(
        <div className={s.usersInline}>
          {row.users?.length ? (
            row.users.map((u) => (
              <span
                key={u.id}
                className={s.userChip}
                onClick={(e) => {
                  e.stopPropagation();
                  tableUI.copyToClipboard(u.name);
                }}
                title="Копіювати"
              >
                {u.name}
              </span>
            ))
          ) : (
            <span className={s.emptyUsers}>—</span>
          )}
        </div>,
        usersCopyValue,
        `users-${row.id}`,
        4
      )}
    </>
  );
};

export default PhoneEditRow;

