import styles from "./ModalActions.module.css";

export default function ModalActions({
  selectedUser,
  onUnbindAll,
  onClose,
  onSave,
}) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.danger}
        style={{
          visibility: selectedUser ? "visible" : "hidden",
        }}
        onClick={onUnbindAll}
      >
        Відв'язати всі телефони
      </button>

      <div className={styles.actionRight}>
        <button
          className={styles.secondary}
          onClick={onClose}
        >
          Скасувати
        </button>

        <button
          className={styles.primary}
          disabled={!selectedUser}
          onClick={onSave}
        >
          Зберегти
        </button>
      </div>
    </div>
  );
}