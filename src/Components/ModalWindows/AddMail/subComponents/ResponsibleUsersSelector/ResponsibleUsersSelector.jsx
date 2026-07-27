
import s from "./ResponsibleUsersSelector.module.css";

export default function ResponsibleUsersSelector({
  ownerType,
  users,
  responsibleUserIds,
  responsibleQuery,
  responsibleOpened,
  filteredResponsibleUsers,
  setResponsibleQuery,
  setResponsibleOpened,
  addResponsibleUser,
  removeResponsibleUser,
}) {
  if (ownerType === "user") {
    return null;
  }

  return (
    <div className={s.field}>
      <label className={s.label}>
        Відповідальні особи
      </label>

      <input
        className={s.input}
        value={responsibleQuery}
        placeholder="Почніть вводити ПІБ"
        onFocus={() => setResponsibleOpened(true)}
        onChange={(e) => {
          setResponsibleQuery(e.target.value);
          setResponsibleOpened(true);
        }}
      />

      {responsibleOpened && (
        <div className={s.dropdown}>
          {filteredResponsibleUsers.map((user) => (
            <div
              key={user.id}
              className={s.option}
              onClick={() => addResponsibleUser(user.id)}
            >
              {user.name}
            </div>
          ))}

          {!filteredResponsibleUsers.length && (
            <div className={s.empty}>
              Нічого не знайдено
            </div>
          )}
        </div>
      )}

      <div className={s.tags}>
        {responsibleUserIds.map((id) => {
          const user = users.find((u) => u.id === id);

          return (
            <div
              key={id}
              className={s.tag}
            >
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

