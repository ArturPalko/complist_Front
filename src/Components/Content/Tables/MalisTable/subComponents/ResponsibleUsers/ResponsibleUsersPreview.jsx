import s from "./ResponsibleUsersPreview.module.css";
import { TdWrapper } from "../../../../../../shared/components/TdWrapper/TdWrapper";

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

const ResponsibleUserPreview = ({
  item,
  col,
  tableUI,
}) => {
  const users = item.responsibleUsers ?? [];

  const preview = getResponsibleUserPreview(
    item.userName,
    users
  );

  return (
    <TdWrapper
      cellKey={col.key}
      rowId={item.id}
      value={preview}
      tableUI={tableUI}
    >
      <div className={s.tooltipWrapper}>
        {preview}

        {!item.userName && users.length > 1 && (
          <div className={s.tooltip}>
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