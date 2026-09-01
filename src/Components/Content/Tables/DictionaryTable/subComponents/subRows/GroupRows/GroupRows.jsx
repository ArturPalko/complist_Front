import s from "../../../../PhonesTable/PhonesTable.module.css";
import { TdWrapper } from "../../../../../../../shared/components/TdWrapper/TdWrapper";
import { GroupRowActions } from "./GroupRowActions/GroupRowActions"
import { entityMap } from "../../../../../../../configs/app/enitiyMap";

const GroupRow = ({
  row,
  tableLogic,
  tableUI,
  isSections,
  isAddUsers,
  dim,
}) => {
  const config =
    entityMap[row.type];

  const name = config
    ? row[config.name]
    : row.name;

  const className =
    config?.className
      ? [
          s[config.className],

          row.type === "department" &&
          !row.presentedOnPhonesPage
            ? s.notPresentedOnPhonesPage
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      : "";

  const showBreak =
    row.type === "department"
      ? tableLogic.dashedBlocks.departments.includes(
          name
        ) &&
        !isSections &&
        !isAddUsers
      : tableLogic.dashedBlocks.sections.includes(
          name
        ) &&
        !isAddUsers;

  return (
    <TdWrapper
      showBreak={showBreak}
      value={name}
      tableUI={tableUI}
      colSpan={99999}
      isHeaderRow={true}
      className={[
        className,
        dim.hidden
          ? ""
          : dim.dimAfterSearchNavigationClass,
        dim.hidden
          ? ""
          : dim.dimAfterPageNumberPressedClass,
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
};

export default GroupRow;

