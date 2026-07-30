import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import s from "./ResponsibleUsersSelector.module.css"
import form  from "../../../../../shared/Css/form.module.css"

export default function ResponsibleUsers({
  users,
  responsibleUserIds,
  addResponsibleUser,
  removeResponsibleUser,
  removeAllResponsibleUsers
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

<div className={s.tags}>
  {responsibleUserIds.map((id) => {
    const user = users.find((u) => u.id === id);

    return (
      <div key={id} className={s.tag}>
        {user?.name}

        <button
          type="button"
          onClick={() => removeResponsibleUser(id)}
        >
          ✕
        </button>
      </div>
    );
  })}
</div>
    </div>
  );
}