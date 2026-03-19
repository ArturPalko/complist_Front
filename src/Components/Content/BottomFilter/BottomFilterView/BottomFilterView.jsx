import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./BottomFilterView.module.css";

import { toggleSubDept } from "../../../../redux/reducers/filterData-reducer";
import {
  toggleAutoSelectHideSections,
  toggleAutoSelectHideUsersWithoutSections
} from "../../../../redux/reducers/filterData-reducer";
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
  selectedOrder,
  toggleDept
}) => {
  const refs = useRef({});
  const dispatch = useDispatch();

  const bookmarks = useSelector(
    state =>
      state.filters.phones?.bookmarks || {
        selectedSubDepts: {},
        selectedOrder: [],
        hideUsersWithoutSections: {},
        hideSections: {}
      }
  );

  // 🔹 текст вибраних департаментів
  const visibleSelected = selectedOrder.slice(0, 3);
  const extraCount = Math.max(0, selectedOrder.length - 3);

  const selectedText =
    visibleSelected.length > 0
      ? visibleSelected.join(", ") +
        (extraCount > 0 ? ` +${extraCount} ще` : "")
      : "Обрати підрозділи";

  return (
    <div className={styles.container}>
      {/* 🔹 кнопка відкриття */}
      <button
        className={styles.button}
        onClick={toggleOpen}
        title={selectedText}
      >
        {selectedText}
      </button>

      {/* 🔹 dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* 🔹 ліва частина */}
          <div className={styles.box}>
            <BottomFilterHeader
              bookmarks={bookmarks}
              onToggleHideUsers={() =>
                dispatch(toggleAutoSelectHideUsersWithoutSections())
              }
              onToggleHideSections={() =>
                dispatch(toggleAutoSelectHideSections())
              }
            />

            <DepartmentsList
              departments={departments}
              selectedSubDepts={selectedSubDepts}
              expandedDept={expandedDept}
              toggleDept={toggleDept}
              toggleExpand={toggleExpand}
              refs={refs}
            />
          </div>

          {/* 🔹 права частина */}
          <SectionsPanel
            expandedDept={expandedDept}
            departments={departments}
            selectedSubDepts={selectedSubDepts}
            hideSections={bookmarks.hideSections}
            onToggleSubDept={(dept, sub) =>
              dispatch(toggleSubDept(dept, sub))
            }
          />
        </div>
      )}
    </div>
  );
};