import s from "./ResponsibleUsersPreview.module.css";
import { TdWrapper } from "../../../../../../shared/components/TdWrapper/TdWrapper";
import { useTooltipPlacement } from "../../../../../../redux/hooks/useToolTipPlacement";

const getResponsibleUserPreview = (
  userName,
  responsibleUsers = []
) => {
  return userName
    ? userName
    : responsibleUsers.length > 1
      ? `${responsibleUsers[0].name} (+${responsibleUsers.length - 1})`
      : responsibleUsers[0]?.name ?? "";
};

const getResponsibleUsersCopyValue = (
  userName,
  responsibleUsers = []
) => {
  if (userName) {
    return userName;
  }

  return responsibleUsers
    .map((user) => user?.name)
    .filter(Boolean)
    .join(", ");
};

const ResponsibleUserPreview = ({
  item,
  col,
  tableUI,
}) => {
  const users = item.responsibleUsers ?? [];

  const {
    triggerRef,
    tooltipRef,
    isBottom,
    updatePlacement,
  } = useTooltipPlacement();

  const preview = getResponsibleUserPreview(
    item.userName,
    users
  );

  const copyValue = getResponsibleUsersCopyValue(
    item.userName,
    users
  );

  const handleMouseEnter = () => {
    if (item.userName || users.length <= 1) {
      return;
    }

    updatePlacement();
  };

  return (
    <TdWrapper
      cellKey={col.key}
      rowId={item.id}
      value={copyValue}
      tableUI={tableUI}
    >
      <div
        ref={triggerRef}
        className={s.tooltipWrapper}
        onMouseEnter={handleMouseEnter}
      >
        {preview}

        {!item.userName && users.length > 1 && (
          <div
            ref={tooltipRef}
            className={`${s.tooltip} ${
              isBottom ? s.tooltipBottom : ""
            }`}
          >
            {users.map((user) => (
              <div
                key={user.id}
                className={s.tooltipItem}
              >
                {user.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </TdWrapper>
  );
};

export default ResponsibleUserPreview;