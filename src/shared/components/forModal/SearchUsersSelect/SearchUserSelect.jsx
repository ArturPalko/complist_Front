import { useMemo, useState } from "react";
import s from "./SearchUserSelect.module.css";

export default function SearchUserSelect({
  users,
  value,
  onChange,
  placeholder = "Почніть вводити ПІБ...",
}) {
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const filteredUsers = useMemo(() => {
    const search = query.toLowerCase();

    return users.filter((user) =>
      user.name.toLowerCase().includes(search)
    );
  }, [users, query]);

  const selectedUser = users.find(
    (user) => Number(user.id) === Number(value)
  );

  return (
    <div className={s.wrapper}>
      <input
        className={s.input}
        value={selectedUser?.name ?? query}
        placeholder={placeholder}
        onFocus={() => setOpened(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange("");
          setOpened(true);
        }}
      />

      {opened && (
        <div className={s.dropdown}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={s.option}
              onClick={() => {
                onChange(user.id);
                setQuery("");
                setOpened(false);
              }}
            >
              {user.name}
            </div>
          ))}

          {!filteredUsers.length && (
            <div className={s.empty}>
              Нічого не знайдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}