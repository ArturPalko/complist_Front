import s from "../../../../PhonesTable/PhonesTable.module.css"
import { TdWrapper } from "../../../../../../../shared/components/TdWrapper/TdWrapper";
import { GroupRowActions } from "../../../../PhonesTable/GroupRowActions";
import { entityMap } from "../../../../../../../configs/app/enitiyMap";

const GroupRow = ({
  row,
  tableLogic,
  tableUI,
  columns,
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

  const groupTotalColumns =
    1 +
    columns.reduce(
      (sum, col) =>
        sum +
        (col.subLabels?.length || 1),
      0
    );

  return (
    <TdWrapper
      showBreak={showBreak}
      value={name}
      tableUI={tableUI}
      colSpan={groupTotalColumns}
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

