import styles from "./DepartmentSectionSelect.module.css";

export default function DepartmentSectionSelect({
  departments,
  selectedDepartment,
  sections,
  departmentId,
  sectionId,
  onDepartmentChange,
  onSectionChange,
}) {
  const truncateText = (text, maxLength = 85) =>
  text.length > maxLength
    ? `${text.slice(0, maxLength)}...`
    : text;
  return (
    <>
      <div className={styles.field}>
        <div className={styles.sectionTitle}>
          Підрозділ
        </div>

        <select
          className={styles.select}
          value={departmentId}
          onChange={onDepartmentChange}
        >
          <option value="">
            Оберіть підрозділ...
          </option>

     {departments.map((department) => (
        <option
          key={department.departmentId}
          value={department.departmentId}
          title={department.departmentName}
        >
          {truncateText(department.departmentName)}
        </option>
      ))}
        </select>
      </div>

      {selectedDepartment && (
        <div className={styles.field}>
          <div className={styles.sectionTitle}>
            Секція
          </div>

          <select
            className={styles.select}
            value={sectionId}
            onChange={onSectionChange}
          >
            <option className={styles.allUsersOption} value="all">
               ───  Користувачі без секції ───
          </option>

            {sections.map((section) => (
              <option
                key={section.sectionId}
                value={section.sectionId}
              >
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}