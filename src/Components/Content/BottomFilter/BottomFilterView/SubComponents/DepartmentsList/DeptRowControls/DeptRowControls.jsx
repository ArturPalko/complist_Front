import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../DeptRowControls/DeptRowControls.module.css";
import usersOutOfDepartmentImg from "../../../../../../../assets/Img/usersOutOfDepartment.png";
import usersOutOfSectionImg from "../../../../../../../assets/Img/usersOutOfSection.png";
import { toggleHideUsersWithoutSections, toggleHideSections } from "../../../../../../../redux/reducers/filterData-reducer";

export const DeptRowControls = React.memo(
  ({ dept, hasSubs, isChecked, isIndeterminate, expandedDept, toggleExpand,activeMenu}) => {
    const dispatch = useDispatch();
    const isActiveMenuPhones = activeMenu== "phones"? true: false
    const bookmarks = useSelector(
      state => state.filters.phones?.bookmarks || {
        hideUsersWithoutSections: {},
        hideSections: {}
      }
    );

    const hideUsers = bookmarks.hideUsersWithoutSections[dept.departmentName] || false;
    const hideSections = bookmarks.hideSections[dept.departmentName] || false;
  
    return (
      <div className={styles.deptRow}>
        {hasSubs && (
          <span
            className={styles.arrow}
            onClick={() => toggleExpand(dept.departmentName)}
          >
            {expandedDept === dept.departmentName ? "▶" : "◀"}
          </span>
        )}

        {(isChecked || isIndeterminate)&& isActiveMenuPhones && hasSubs && (
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
                title="Користувачі без департаменту"
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
                title="Користувачі без секції"
                className={styles.centeredCheckboxImg}
              />
            </label>
          </div>
        )}
      </div>
    );
  }
);