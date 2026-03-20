import styles from "./BottomFilterHeader.module.css";

export const BottomFilterHeader = ({

  bookmarks,
  departments,
  onToggleHideUsers,
  onToggleHideSections,
  onToggleSelectALL
}) => {
  return (
    <div className={styles.headerWithToggles}>
      <h4>Підрозділи</h4>

      <button
        className={`${styles.toggleBtn} ${
          bookmarks.allHideUsersWithoutSections ? styles.active : ""
        }`}
        onClick={onToggleHideUsers}
      >
        Прибрати контакти не у секції
      </button>

      <button
        className={`${styles.toggleBtn} ${
          bookmarks.allHideSections ? styles.active : ""
        }`}
        onClick={onToggleHideSections}
      >
        Прибрати секції
      </button>

           <button
        className={`${styles.toggleAllDeptartmentsBtn} ${
          Object.keys(bookmarks.selectedSubDepts).length == departments.length ? styles.active : ""
        }`}
        onClick={onToggleSelectALL}
      >
        Усе
      </button>
    </div>
  );
};