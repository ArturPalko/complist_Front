import s from "../../../../PhonesTable/PhonesTable.module.css";

const UsersTableHeader = ({
  sortConfig,
  onSort,
}) => {
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

  const renderSortableHeader = (key, label) => (
    <th
      className={s.sortableHeader}
      onClick={() => onSort(key)}
    >
      <span>
        {label} {renderSortArrow(key)}
      </span>
    </th>
  );

  return (
    <tr>
      <th>№</th>

      {renderSortableHeader(
        "name",
        "Користувач"
      )}

      {renderSortableHeader(
        "userType",
        "Тип користувача"
      )}

      {renderSortableHeader(
        "department",
        "Департамент"
      )}

      {renderSortableHeader(
        "section",
        "Секція"
      )}

      {renderSortableHeader(
        "isActive",
        "Статус"
      )}
    </tr>
  );
};

export default UsersTableHeader;

