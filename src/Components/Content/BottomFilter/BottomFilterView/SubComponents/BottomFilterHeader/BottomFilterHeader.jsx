import React from "react";
import s from "./BottomFilterHeader.module.css";

export const BottomFilterHeader = ({
  bookmarks,
  departments,
  onAutoToggleHideUsers,
  onAutoToggleHideSections,
  onToggleSelectALL,
  showExtraToggles
}) => {

const isAllDepartmentsSelected =
  Object.keys(bookmarks?.selectedSubDepts || {}).length === departments.length;

  return (
    <div className={s.headerWithToggles}>
      <h4>Підрозділи</h4>

      {showExtraToggles && (
        <>
          <button
            className={`${s.toggleBtn} ${
              bookmarks.allHideUsersWithoutSections ? s.active : ""
            }`}
            onClick={onAutoToggleHideUsers}
          >
            Прибрати контакти не у секції
          </button>

          <button
            className={`${s.toggleBtn} ${
              bookmarks.allHideSections ? s.active : ""
            }`}
            onClick={onAutoToggleHideSections}
          >
            Прибрати секції
          </button>
        </>
      )}

      <button
          className={`${s.toggleAllDeptartmentsBtn} ${
        isAllDepartmentsSelected ? s.active : ""
      }`}
        onClick={onToggleSelectALL}
      >
        Усе
      </button>
    </div>
  );
};