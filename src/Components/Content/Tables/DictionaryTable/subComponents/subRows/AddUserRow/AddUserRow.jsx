import s from "../../../../PhonesTable/PhonesTable.module.css"
import { TdWrapper } from "../../../../../../../shared/components/TdWrapper/TdWrapper";

const AddUsersRow = ({
  row,
  index,
  tableUI,
}) => {
  const inactive = !row.isActive;
  debugger

  return (
    <>
      <td
        className={
          inactive ? s.inactive : ""
        }
      >
        {index + 1}
      </td>

      <TdWrapper
        value={row.name}
        tableUI={tableUI}
        inactive={inactive}
      >
        {row.name}
      </TdWrapper>

      <TdWrapper
        value={row.positionName}
        tableUI={tableUI}
        inactive={inactive}
      >
        {row.positionName}
      </TdWrapper>

      <TdWrapper
        value={row.userType}
        tableUI={tableUI}
        inactive={inactive}
      >
        {row.userType}
      </TdWrapper>
    </>
  );
};

export default AddUsersRow;

