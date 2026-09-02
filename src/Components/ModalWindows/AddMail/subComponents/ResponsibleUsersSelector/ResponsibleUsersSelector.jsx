import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import s from "./ResponsibleUsersSelector.module.css";
import form from "../../../../../shared/Css/form.module.css";

export default function ResponsibleUsers({
  users,
  responsibleUserIds,
  addResponsibleUser,
  removeResponsibleUser,
  removeAllResponsibleUsers,
}) {
  return (
    <div className={s.wrapper}>
      <label className={form.label}>
        Відповідальні користувачі
      </label>

      <SearchUserSelect
        users={users}
        value={null}
        onChange={addResponsibleUser}
      />

      {responsibleUserIds.length > 0 && (
        <>
          <div className={s.tagsHeader}>
            {responsibleUserIds.length > 1 && (
              <button
                type="button"
                className={s.clearButton}
                onClick={removeAllResponsibleUsers}
                title="Видалити всіх відповідальних"
              >
                ✕
              </button>
            )}
          </div>

          <div className={s.tagsContainer}>
            <div className={s.tags}>
              {responsibleUserIds.map((id) => {
                const user = users.find(
                  (u) => Number(u.id) === Number(id)
                );

                return (
                  <div key={id} className={s.tag}>
                    <span className={s.tagName}>
                      {user?.name}
                    </span>

                    <button
                      type="button"
                      className={s.removeButton}
                      onClick={() =>
                        removeResponsibleUser(id)
                      }
                      title="Видалити користувача"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}