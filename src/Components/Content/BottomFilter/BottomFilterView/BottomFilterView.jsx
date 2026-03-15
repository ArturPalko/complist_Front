import React, { useRef } from "react";
import styles from "./BottomFilterView.module.css";

export const BottomFilterView = ({
  isOpen,
  toggleOpen,
  departments,
  expandedDept,
  toggleExpand,
  selectedSubDepts,
  selectedOrder,
  toggleDept,
  toggleSubDept
}) => {
  const refs = useRef({});

  const visibleSelected = selectedOrder.slice(0, 2);
  const extraCount = Math.max(0, selectedOrder.length - 2);
  const selectedText = visibleSelected.length > 0
    ? visibleSelected.join(", ") + (extraCount > 0 ? ` +${extraCount} ще` : "")
    : "Оберіть підрозділи";

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={toggleOpen}
        title={selectedText}
      >
        {selectedText}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.box}>
            <h4>Підрозділи</h4>
            {departments.map(dept => {
              const selectedSubs = selectedSubDepts[dept.departmentName] || [];
              const hasSubs = dept.sections?.length > 0;
              const isChecked = hasSubs
                ? selectedSubs.length === dept.sections.length
                : !!selectedSubDepts[dept.departmentName];
              const isIndeterminate = hasSubs && selectedSubs.length > 0 && selectedSubs.length < dept.sections.length;

              return (
                <div key={dept.departmentName} className={styles.deptLabel}>
                  <label>
                    <input
                      type="checkbox"
                      ref={el => {
                        refs.current[dept.departmentName] = el;
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      checked={isChecked}
                      onChange={() => toggleDept(dept.departmentName)}
                    />
                    {dept.departmentName}
                  </label>

                  {hasSubs && (
                    <span className={styles.arrow} onClick={() => toggleExpand(dept.departmentName)}>
                      {expandedDept === dept.departmentName ? "▶" : "◀"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.boxRight}>
            <h4>Підпідрозділи</h4>
            {expandedDept === null && <p>Натисніть стрілку ліворуч, щоб показати підпідрозділи</p>}
            {expandedDept && (
              <div>
                {(departments.find(d => d.departmentName === expandedDept)?.sections || []).map(sub => (
                  <label key={sub.sectionId || sub} className={styles.subLabel}>
                    <input
                      type="checkbox"
                      checked={selectedSubDepts[expandedDept]?.includes(sub.sectionName) || false}
                      onChange={() => toggleSubDept(expandedDept, sub.sectionName)}
                    />
                    {sub.sectionName || sub}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};