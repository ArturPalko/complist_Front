import styles from "./BindPhonesToUser.module.css";

export default function BindPhonesToUserHeader({ onClose }) {
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.title}>
          Телефони користувача
        </div>

        <div className={styles.subtitle}>
          Керування телефонними прив'язками
        </div>
      </div>

      <button
        className={styles.close}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}