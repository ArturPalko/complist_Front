import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDepartmentsAndSections, selectBookmarks } from "../../../redux/selectors/selector";
import { setBookmark } from "../../../redux/reducers/filterData-reducer";
import styles from "./BottomFilter.module.css";
import { toogleSubDept as se } from "../../../redux/reducers/filterData-reducer";

export const BottomFilter = () => {

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);

  const refs = useRef({});

  const depSec = useSelector(getDepartmentsAndSections);
  debugger;
   
  const departments = depSec.departments || [];

  const bookmarks = useSelector(selectBookmarks);

  const selectedSubDepts = bookmarks.selectedSubDepts;
  const selectedOrder = bookmarks.selectedOrder;

  const toggleDept = (deptName) => {

    const dept = departments.find(
      d => d.departmentName === deptName
    );
debugger;
    dispatch(
      setBookmark(
        deptName,
        dept?.sections || []
      )
    );

  };

  const toggleSubDept = (deptName, sub) => {
debugger;
    dispatch(
      se(
        deptName,
        [sub]
      )
    );

  };

  const toggleExpand = (deptName) => {
    setExpandedDept(
      expandedDept === deptName ? null : deptName
    );
  };

  useEffect(() => {

    departments.forEach(dept => {

      const allSubs = dept.sections || [];
      const selectedSubs =
        selectedSubDepts[dept.departmentName] || [];

      const ref = refs.current[dept.departmentName];

      if (ref && allSubs.length > 0) {
        ref.indeterminate =
          selectedSubs.length > 0 &&
          selectedSubs.length < allSubs.length;
      }

    });

  }, [selectedSubDepts, departments]);

  const visibleCount = 2;

  const visibleSelected =
    selectedOrder.slice(0, visibleCount);

  const extraCount =
    Math.max(0, selectedOrder.length - visibleCount);

  const selectedText =
    visibleSelected.length > 0
      ? visibleSelected.join(", ") +
        (extraCount > 0 ? ` +${extraCount} ще` : "")
      : "Оберіть підрозділи";

  return (

    <div className={styles.container}>

      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        title={selectedText}
      >
        {selectedText}
      </button>

      {isOpen && (

        <div className={styles.dropdown}>

          <div className={styles.box}>

            <h4>Підрозділи</h4>

            {departments.map(dept => {

              const selectedSubs =
                selectedSubDepts[dept.departmentName] || [];

              const hasSubs =
                dept.sections?.length > 0;

              const isChecked = hasSubs
                ? selectedSubs.length === dept.sections.length
                : !!selectedSubDepts[dept.departmentName];

              const isIndeterminate =
                hasSubs &&
                selectedSubs.length > 0 &&
                selectedSubs.length < dept.sections.length;

              return (

                <div
                  key={dept.departmentName}
                  className={styles.deptLabel}
                >

                  <label>

                    <input
                      type="checkbox"
                      ref={el => {
                        refs.current[
                          dept.departmentName
                        ] = el;

                        if (el)
                          el.indeterminate =
                            isIndeterminate;
                      }}
                      checked={isChecked}
                      onChange={() =>
                        toggleDept(
                          dept.departmentName
                        )
                      }
                    />

                    {" "}
                    {dept.departmentName}

                  </label>

                  {hasSubs &&

                    <span
                      className={styles.arrow}
                      onClick={() =>
                        toggleExpand(
                          dept.departmentName
                        )
                      }
                    >
                      {expandedDept ===
                      dept.departmentName
                        ? "▶"
                        : "◀"}
                    </span>

                  }

                </div>

              );

            })}

          </div>

          <div className={styles.boxRight}>

            <h4>Підпідрозділи</h4>

            {expandedDept === null &&
              <p>
                Натисніть стрілку ліворуч,
                щоб показати підпідрозділи
              </p>
            }

            {expandedDept && (

              <div>

                {(departments.find(
                  d =>
                    d.departmentName ===
                    expandedDept
                )?.sections || []).map(sub => (

                  <label
                    key={sub.sectionId || sub}
                    className={styles.subLabel}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedSubDepts[
                          expandedDept
                        ]?.includes(sub) || false
                      }
                      onChange={() =>
                        toggleSubDept(
                          expandedDept,
                          sub
                        )
                      }
                    />

                    {" "}
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

export default BottomFilter;