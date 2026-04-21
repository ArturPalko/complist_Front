import React from "react";
import { useSelector } from "react-redux";
import s from "../DeptRowControls/DeptRowControls.module.css";
import usersOutOfDepartmentImg from "../../../../../../../assets/Img/usersOutOfDepartment.png";
import usersOutOfSectionImg from "../../../../../../../assets/Img/usersOutOfSection.png";

export const DeptRowControls = React.memo(
  ({
    dept,
    hasSubs,
    isChecked,
    isIndeterminate,
    expandedDept,
    toggleExpand,
    activeMenu,
    onToggleHideSections,
    onToggleHideUsers,
    showExtraToggles,
    bookmarks
  }) => {

const hideUsers = Boolean(
  bookmarks?.hideUsersWithoutSections?.[dept.departmentName]
);

const hideSections = Boolean(
  bookmarks?.hideSections?.[dept.departmentName]
);

    return (
      <div className={s.deptRow}>

        {hasSubs && (
          <span
            className={s.arrow}
            onClick={() => toggleExpand(dept.departmentName)}
          >
            {expandedDept === dept.departmentName ? "▶" : "◀"}
          </span>
        )}

        {(isChecked || isIndeterminate) && showExtraToggles && hasSubs && (
          <div className={s.additionalCheckboxesColumn}>

            <label className={s.imgCheckboxLabel}>
              <input
                type="checkbox"
                checked={hideUsers}
                onChange={() =>
                  onToggleHideUsers(dept.departmentName)
                }
              />
              <img
                src={usersOutOfDepartmentImg}
                alt="Користувачі без департаменту"
                title="Користувачі без департаменту"
                className={s.centeredCheckboxImg}
              />
            </label>

            <label className={s.imgCheckboxLabel}>
              <input
                type="checkbox"
                checked={hideSections}
                onChange={() =>
                  onToggleHideSections(dept.departmentName)
                }
              />
              <img
                src={usersOutOfSectionImg}
                alt="Користувачі без секції"
                title="Користувачі без секції"
                className={s.centeredCheckboxImg}
              />
            </label>

          </div>
        )}
      </div>
    );
  }
);