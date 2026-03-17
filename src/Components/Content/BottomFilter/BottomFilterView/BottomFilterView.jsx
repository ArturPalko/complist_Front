import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./BottomFilterView.module.css";
import {
  toggleHideUsersWithoutSections,
  toggleHideSections,
  toggleSubDept
} from "../../../../redux/reducers/filterData-reducer";

import usersOutOfDepartmentImg from "../../../../assets/Img/usersOutOfDepartment.png";
import usersOutOfSectionImg from "../../../../assets/Img/usersOutOfSection.png";

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

              const isIndeterminate =
                hasSubs && selectedSubs.length > 0 && selectedSubs.length < dept.sections.length;

              const hideUsers = bookmarks.hideUsersWithoutSections[dept.departmentName] || false;
              const hideSections = bookmarks.hideSections[dept.departmentName] || false;

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
                    <span
                      className={styles.arrow}
                      onClick={() => toggleExpand(dept.departmentName)}
                    >
                      {expandedDept === dept.departmentName ? "▶" : "◀"}
                    </span>
                  )}

                  {/* Додаткові чекбокси рендеряться тільки для вибраного департаменту */}
{(isChecked || isIndeterminate) && hasSubs && (
  <div className={styles.additionalCheckboxesColumn}>
    <label className={styles.imgCheckboxLabel}>
      <input
        type="checkbox"
        checked={hideUsers}
        onChange={() =>
          dispatch(toggleHideUsersWithoutSections(dept.departmentName))
        }
      />
      <img
        src={usersOutOfDepartmentImg}
        alt="Користувачі без департаменту"
        className={styles.centeredCheckboxImg}
      />
    </label>

    <label className={styles.imgCheckboxLabel}>
      <input
        type="checkbox"
        checked={hideSections}
        onChange={() =>
          dispatch(toggleHideSections(dept.departmentName))
        }
      />
      <img
        src={usersOutOfSectionImg}
        alt="Користувачі без секції"
        className={styles.centeredCheckboxImg}
        
      />
    </label>
  </div>
)}
                </div>
              );
            })}
          </div>

          <div className={styles.boxRight}>
            <h4>Підпідрозділи</h4>
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