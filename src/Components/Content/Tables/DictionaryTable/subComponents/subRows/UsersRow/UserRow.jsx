import d from "../../../DicitonaryTable.module.css"
import { TdWrapper } from "../../../../../../../shared/components/TdWrapper/TdWrapper";

const UsersRow = ({
  row,
  index,
  pageNumber,
  rowsPerPage,
  tableUI,
}) => {
  const inactive = !row.isActive;

  const rowNumber =
    (pageNumber - 1) *
      rowsPerPage +
    index +
    1;

  return (
    <>
      <TdWrapper
        value={rowNumber}
        tableUI={tableUI}
        inactive={inactive}
      >
        {rowNumber}
      </TdWrapper>

      <TdWrapper
        value={row.name}
        tableUI={tableUI}
        inactive={inactive}
      >
        {row.name}
      </TdWrapper>

      <TdWrapper
        value={row.userType}
        tableUI={tableUI}
        inactive={inactive}
      >
        {row.userType}
      </TdWrapper>

      <TdWrapper
        value={row.department}
        tableUI={tableUI}
        className={d.userDepartment}
        inactive={inactive}
      >
        {row.department}
      </TdWrapper>

      <TdWrapper
        value={row.section}
        tableUI={tableUI}
        className={d.userSection}
        inactive={inactive}
      >
        {row.section}
      </TdWrapper>

      <TdWrapper
        value={
          row.isActive
            ? "Активний"
            : "Неактивний"
        }
        tableUI={tableUI}
        inactive={inactive}
      >
        {row.isActive
          ? "Активний"
          : "Неактивний"}
      </TdWrapper>
    </>
  );
};

export default UsersRow;

