import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import s from "./OwnerSelector.module.css";
import form from "../../../../../shared/Css/form.module.css";

export default function OwnerSelector({
  ownerType,
  ownerId,

  users,
  departments,
  sections,

  setOwnerType,
  setOwnerId,
  setQuery,
  setOpened,
}) {
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
    <div className={s.wrapper}>
      <div>
        <label className={form.label}>
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
        <div>
          <label className={form.label}>
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
        <div>
          <label className={form.label}>
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
  );
}