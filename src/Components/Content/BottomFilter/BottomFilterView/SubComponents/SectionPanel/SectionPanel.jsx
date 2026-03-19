
import styles from "./SectionPanel.module.css";

export const SectionsPanel = ({
  expandedDept,
  departments,
  selectedSubDepts,
  hideSections,
  onToggleSubDept
}) => {
  const currentDept = departments.find(
    d => d.departmentName === expandedDept
  );

  const sections = currentDept?.sections || [];

  return (
    <div className={styles.boxRight}>
      <h4>Секції</h4>

      {expandedDept === null && (
        <p>Натисніть стрілку ліворуч, щоб показати підпідрозділи</p>
      )}

      {expandedDept && !hideSections[expandedDept] && (
        <div>
          {sections.map(sub => {
            const sectionName = sub.sectionName || sub;

            return (
              <label
                key={sub.sectionId || sectionName}
                className={styles.subLabel}
              >
                <input
                  type="checkbox"
                  checked={
                    selectedSubDepts[expandedDept]?.includes(sectionName) ||
                    false
                  }
                  onChange={() =>
                    onToggleSubDept(expandedDept, sectionName)
                  }
                />
                {sectionName}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};