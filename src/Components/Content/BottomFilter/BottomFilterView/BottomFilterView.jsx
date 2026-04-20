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
  activeMenu,
  bookmarks,
  refs,
  onToggleSelectAll,
  onToggleHideUsers,
  onToggleDept,
  onToggleSubDept,
  onToggleHideSections

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
              activeMenu={activeMenu}
              bookmarks={bookmarks}
              departments={departments}
              onToggleSelectALL ={onToggleSelectAll}
              onToggleHideUsers={onToggleHideUsers}
              onToggleHideSections={onToggleHideSections}
            />

            <DepartmentsList
              activeMenu ={activeMenu}
              departments={departments}
              selectedSubDepts={selectedSubDepts}
              expandedDept={expandedDept}
              onToggleDept={onToggleDept}
              toggleExpand={toggleExpand}
              refs={refs}
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

