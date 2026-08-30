import s from "../../../AddMail/AddMail.module.css"
import form from "../../../../../shared/Css/form.module.css";

export default function TransferDestination({
  transferType,
  departmentId,
  sectionId,
  departments,
  sections,
  onTransferTypeChange,
  onDepartmentChange,
  onSectionChange,
}) {
    const truncateText = (text, maxLength = 45) =>
  text.length > maxLength
    ? `${text.slice(0, maxLength)}...`
    : text;
  return (
    <>
      {/* =========================
          Transfer type
      ========================= */}
      

      <div>
        <label className={form.label}>
          Тип переведення
        </label>

        <select
          className={`${form.select} ${form.focusBlue}`}
          value={transferType}
          onChange={onTransferTypeChange}
        >
          <option value="department">
            Департамент
          </option>

          <option value="section">
            Секція
          </option>
        </select>
      </div>

      {/* =========================
          Department
      ========================= */}

      <div>
        <label className={form.label}>
          Департамент
        </label>

        <select
          className={`${form.select} ${form.focusBlue}`}
          value={departmentId}
          onChange={onDepartmentChange}
        >
          <option value="">
            Оберіть департамент
          </option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.id}
            >
              {truncateText(department.name)}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
          Section
      ========================= */}

      {transferType === "section" && (
        <div>
          <label className={form.label}>
            Секція
          </label>

          <select
            className={`${form.select} ${form.focusBlue}`}
            value={sectionId}
            onChange={onSectionChange}
            disabled={
              departmentId === "" ||
              sections.length === 0
            }
          >
            <option value="">
              {departmentId === ""
                ? "Спочатку оберіть департамент"
                : sections.length === 0
                  ? "У цього департаменту немає секцій"
                  : "Оберіть секцію"}
            </option>

            {sections.map((section) => (
              <option
                key={section.id}
                value={section.id}
              >
                {section.name}
              </option>
            ))}
          </select>

          {departmentId !== "" &&
            sections.length === 0 && (
              <div className={s.error}>
                Обраний департамент не має
                секцій. Оберіть інший департамент
                або тип переведення
                «Департамент».
              </div>
            )}
        </div>
      )}
    </>
  );
}

