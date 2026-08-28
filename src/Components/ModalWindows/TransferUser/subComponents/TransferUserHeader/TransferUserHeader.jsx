
import styles from "../TransferUserHeader.module.css"

export default function TransferUserHeader({ onClose }) {
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.title}>
          Перевести користувача
        </div>

        <div className={styles.subtitle}>
          Керування переведенням користувача
        </div>
      </div>

      <button
        type="button"
        className={styles.close}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

