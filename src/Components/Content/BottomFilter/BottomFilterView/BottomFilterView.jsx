import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./BottomFilterView.module.css";
import { toggleSubDept } from "../../../../redux/reducers/filterData-reducer";
import { DeptRowControls } from "../DeptRowControls/DeptRowControls";
import { toggleAutoSelectHideSections, toggleAutoSelectHideUsersWithoutSections } from "../../../../redux/reducers/filterData-reducer";

export const BottomFilterView = ({
  isOpen,
  toggleOpen,
  departments,
  expandedDept,
  toggleExpand,
  selectedSubDepts,
  selectedOrder,
  toggleDept
}) => {
  const refs = useRef({});
  const dispatch = useDispatch();

  const bookmarks = useSelector(
    state => state.filters.phones?.bookmarks || {
      selectedSubDepts: {},
      selectedOrder: [],
      hideUsersWithoutSections: {},
      hideSections: {}
    }
  );

  const visibleSelected = selectedOrder.slice(0, 3);
  const extraCount = Math.max(0, selectedOrder.length - 3);
  const selectedText = visibleSelected.length > 0
    ? visibleSelected.join(", ") + (extraCount > 0 ? ` +${extraCount} ще` : "")
    : "Обрати підрозділи";

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
    <div className={styles.headerWithToggles}>
  <h4>Підрозділи</h4>

  <button
  className={`${styles.toggleBtn} ${
    bookmarks.allHideUsersWithoutSections ? styles.active : ""
  }`}
  onClick={() => dispatch(toggleAutoSelectHideUsersWithoutSections())}
>
  Прибрати контакти не у секції
</button>

<button
  className={`${styles.toggleBtn} ${
    bookmarks.allHideSections ? styles.active : ""
  }`}
  onClick={() => dispatch(toggleAutoSelectHideSections())}
>
  Прибрати секції
</button>
</div>
            {departments.map(dept => {
              const selectedSubs = selectedSubDepts[dept.departmentName] || [];
              const hasSubs = dept.sections?.length > 0;

              const isChecked = hasSubs
                ? selectedSubs.length === dept.sections.length
                : !!selectedSubDepts[dept.departmentName];

              const isIndeterminate =
                hasSubs && selectedSubs.length > 0 && selectedSubs.length < dept.sections.length;

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

                  <DeptRowControls
                    dept={dept}
                    hasSubs={hasSubs}
                    isChecked={isChecked}
                    isIndeterminate={isIndeterminate}
                    expandedDept={expandedDept}
                    toggleExpand={toggleExpand}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.boxRight}>
            <h4>Секції</h4>
            {expandedDept === null && <p>Натисніть стрілку ліворуч, щоб показати підпідрозділи</p>}
            {expandedDept && !bookmarks.hideSections[expandedDept] && (
              <div>
                {(departments.find(d => d.departmentName === expandedDept)?.sections || []).map(
                  sub => (
                    <label key={sub.sectionId || sub} className={styles.subLabel}>
                      <input
                        type="checkbox"
                        checked={
                          selectedSubDepts[expandedDept]?.includes(sub.sectionName) || false
                        }
                        onChange={() =>
                          dispatch(toggleSubDept(expandedDept, sub.sectionName))
                        }
                      />
                      {sub.sectionName || sub}
                    </label>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};