import React from "react";
import s from "./BottomFilterView.module.css";
import { BottomFilterHeader } from "./SubComponents/BottomFilterHeader/BottomFilterHeader";
import { DepartmentsList } from "./SubComponents/DepartmentsList/DepartmentList";
import { SectionsPanel } from "./SubComponents/SectionPanel/SectionPanel";


export const BottomFilterView = ({
  isOpen,
  toggleOpen,
  departments,
  expandedDept,
  toggleExpand,
  selectedSubDepts,
  selectedText,
  bookmarks,
  refs,
  onToggleHideSections,
  onToggleHideUsers,
  onToggleSelectAll,
  onAutoToggleHideSections,
  onAutoToggleHideUsers,
  onAutoToggleDept,
  onToggleDept,
  onToggleSubDept,
  showExtraToggles

}) => {
  return (
    <div className={s.container}>
      {/*кнопка відкриття */}
      <button
        className={s.button}
        onClick={toggleOpen}
        title={"Обрані підрозділи"}
      >
        {selectedText}
      </button>

      {/*dropdown */}
      {isOpen && (
        <div className={s.dropdown}>
          {/*ліва частина */}
          <div className={s.box}>
            <BottomFilterHeader
              bookmarks={bookmarks}
              departments={departments}
              onToggleSelectALL ={onToggleSelectAll}
              onAutoToggleHideUsers={onAutoToggleHideUsers}
              onAutoToggleHideSections={onAutoToggleHideSections}
              showExtraToggles={showExtraToggles}
            />

            <DepartmentsList
              bookmarks={bookmarks}
              departments={departments}
              selectedSubDepts={selectedSubDepts}
              expandedDept={expandedDept}
              onToggleDept={onToggleDept}
              toggleExpand={toggleExpand}
              refs={refs}
              showExtraToggles={showExtraToggles}
              onToggleHideSections={onToggleHideSections}
              onToggleHideUsers={onToggleHideUsers}
            
            />
          </div>

          {/* права частина */}
          <SectionsPanel
            expandedDept={expandedDept}
            departments={departments}
            selectedSubDepts={selectedSubDepts}
            hideSections={bookmarks.hideSections}
            onToggleSubDept={onToggleSubDept}
          />
        </div>
      )}
    </div>
  );
};

