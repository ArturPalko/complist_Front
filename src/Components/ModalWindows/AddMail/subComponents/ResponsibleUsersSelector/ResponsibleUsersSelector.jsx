import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import s from "./ResponsibleUsersSelector.module.css"

export default function ResponsibleUsers({
  users,
  responsibleUsers,
  addResponsibleUser,
  removeResponsibleUser,
}) {
  return (
    <div className={s.field}>
      <label className={s.label}>
        Відповідальні користувачі
      </label>

      <SearchUserSelect
        users={users}
        value={null}
        onChange={addResponsibleUser}
      />

      <div className={s.selectedUsers}>
        {responsibleUsers.map((user) => (
          <div
            key={user.id}
            className={s.tag}
          >
            <span>{user.name}</span>

            <button
              type="button"
              className={s.removeButton}
              onClick={() => removeResponsibleUser(user.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}