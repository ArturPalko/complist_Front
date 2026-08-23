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
}) {
  const handleOwnerTypeChange = (value) => {
    setOwnerType(value);

    // Старий одиночний owner
    setOwnerId("");

    // Секції
    setOwnerIds([]);

    // Департамент-фільтр для секцій
    setSectionDepartmentId("");

    setQuery("");
    setOpened(false);
  };

  const handleSectionDepartmentChange = (e) => {
    const value = e.target.value;

    setSectionDepartmentId(
      value === "" ? "" : Number(value)
    );

    // При зміні департаменту старі секції більше
    // не повинні залишатися вибраними
    setOwnerIds([]);
  };

  const handleSectionChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );

    setOwnerIds(selectedIds);
  };

  const filteredSections =
    sectionDepartmentId === ""
      ? []
      : sections.filter(
          (section) =>
            Number(section.departmentId) ===
            Number(sectionDepartmentId)
        );

        console.log("DEPARTMENTS:", departments);
console.log("SECTIONS:", sections);
console.log(
  "SELECTED DEPARTMENT:",
  sectionDepartmentId
);

  return (
    <div className={s.wrapper}>
      {/* Тип власника */}
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
            Секції
          </option>

          <option value="user">
            Користувач
          </option>
        </select>
      </div>

      {/* ========================= */}
      {/* DEPARTMENT */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* SECTION */}
      {/* ========================= */}

      {ownerType === "section" && (
        <>
          {/* Департамент-фільтр */}
          <div>
            <label className={form.label}>
              Департамент
            </label>

            <select
              className={s.select}
              value={sectionDepartmentId}
              onChange={
                handleSectionDepartmentChange
              }
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

          {/* Секції */}
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

      {/* ========================= */}
      {/* USER */}
      {/* ========================= */}

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