import { useMemo } from "react";
import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import s from "./OwnerSelector.module.css"

export default function OwnerSelector({
  ownerType,
  ownerId,
  query,
  opened,

  users,
  departments,
  sections,

  setOwnerType,
  setOwnerId,
  setQuery,
  setOpened,
}) {
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  const handleOwnerTypeChange = (value) => {
    setOwnerType(value);
    setOwnerId("");
    setQuery("");
    setOpened(false);
  };

  const selectData =
    ownerType === "department"
      ? {
          label: "Департамент",
          values: departments,
        }
      : {
          label: "Секція",
          values: sections,
        };

  return (
    <>
      <div> 
      <div className={s.field}>
        <label className={s.label}>
          Тип власника
        </label>

        <select
          className={s.select}
          value={ownerType}
          onChange={(e) =>
            handleOwnerTypeChange(e.target.value)
          }
        >
          <option value="department">
            Департамент
          </option>

          <option value="section">
            Секція
          </option>

          <option value="user">
            Користувач
          </option>
        </select>
      </div>

      {ownerType !== "user" && (
        <div className={s.field}>
          <label className={s.label}>
            {selectData.label}
          </label>

          <select
            className={s.select}
            value={ownerId}
            onChange={(e) =>
              setOwnerId(Number(e.target.value))
            }
          >
            <option value="">
              Оберіть
            </option>

            {selectData.values.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {ownerType === "user" && (
  <div className={s.field}>
    <label className={s.label}>
      Користувач
    </label>

    <SearchUserSelect
      users={users}
      value={ownerId}
      onChange={setOwnerId}
    />
  </div>
)}
        </div>
    </>
  );
}