import s from "../../../PhonesTable/PhonesTable.module.css"
import { TdWrapper } from "../../../../../../shared/components/TdWrapper/TdWrapper";
import { getUserRowIndex } from "../../../PhonesTable/phonesTableHelpers";
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

  return (
    <>
      <td>{phoneRowIndex}</td>

      {renderTd(row.number, `phone-num-${row.id}`)}

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
};

export default PhoneEditRow;