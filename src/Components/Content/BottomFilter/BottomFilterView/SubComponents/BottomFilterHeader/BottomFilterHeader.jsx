import styles from "./BottomFilterHeader.module.css";

export const BottomFilterHeader = ({
  bookmarks,
  onToggleHideUsers,
  onToggleHideSections
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
    </div>
  );
};