import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import s from "./OwnerSelector.module.css";
import form from "../../../../../shared/Css/form.module.css";

export default function OwnerSelector({
  ownerType,
  ownerId,
  ownerIds,
  sectionDepartmentId,
  users,
  departments,
  sections,
  setOwnerType,
  setOwnerId,
  setOwnerIds,
  setSectionDepartmentId,
  setQuery,
  setOpened,
  ownerDisplayName,
  setOwnerDisplayName,
}) {
  const handleOwnerTypeChange = (value) => {
    setOwnerType(value);
    setOwnerId("");
    setOwnerIds([]);
    setSectionDepartmentId("");
    setQuery("");
    setOpened(false);

    if (value !== "none" && value !== "section") {
      setOwnerDisplayName("");
    }
  };

  const handleSectionDepartmentChange = (e) => {
    const value = e.target.value;

    setSectionDepartmentId(
      value === "" ? "" : Number(value)
    );

    setOwnerIds([]);
    setOwnerDisplayName("");
  };

  const handleSectionChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );

    setOwnerIds(selectedIds);

    if (selectedIds.length <= 1) {
      setOwnerDisplayName("");
    }
  };

  const filteredSections =
    sectionDepartmentId === ""
      ? []
      : sections.filter(
          (section) =>
            Number(section.departmentId) ===
            Number(sectionDepartmentId)
        );

  const showOwnerDisplayName =
    ownerType === "none" ||
    (
      ownerType === "section" &&
      ownerIds.length > 1
    );

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
          <optgroup label="Власник">
            <option value="department">
              Підрозділ
            </option>
            <option value="section">
              Секція
            </option>
            <option value="user">
              Користувач
            </option>
          </optgroup>

          <optgroup label="Інше">
            <option value="none">
              Без власника
            </option>
          </optgroup>
        </select>
      </div>

      {ownerType === "department" && (
        <div>
          <label className={form.label}>
            Департамент
          </label>

          <select
            className={s.select}
            value={ownerId}
            onChange={(e) =>
              setOwnerId(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
          >
            <option value="">
              Оберіть
            </option>

            {departments.map((item) => (
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

      {ownerType === "section" && (
        <>
          <div>
            <label className={form.label}>
              Департамент
            </label>

            <select
              className={s.select}
              value={sectionDepartmentId}
              onChange={handleSectionDepartmentChange}
            >
              <option value="">
                Оберіть департамент
              </option>

              {departments.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {sectionDepartmentId !== "" && (
            <div>
              <label className={form.label}>
                Секції
              </label>

              <select
                className={s.select}
                multiple
                value={ownerIds}
                onChange={handleSectionChange}
              >
                {filteredSections.length === 0 ? (
                  <option disabled>
                    У цього департаменту немає секцій
                  </option>
                ) : (
                  filteredSections.map((section) => (
                    <option
                      key={section.id}
                      value={section.id}
                    >
                      {section.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}
        </>
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

      {showOwnerDisplayName && (
        <div>
          <label className={form.label}>
            Умовна назва власника
          </label>

          <input
            type="text"
            className={s.select}
            value={ownerDisplayName ?? ""}
            onChange={(e) =>
              setOwnerDisplayName(e.target.value)
            }
            placeholder="Наприклад: Автомобільний МП «Львів»"
          />
        </div>
      )}
    </div>
  );
}