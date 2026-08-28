import styles from "./TransferOptions.module.css";

export default function TransferOptions({
  keepResponsibleForMails,
  setKeepResponsibleForMails,
  keepPhonesByPosition,
  setKeepPhonesByPosition,
  transferPhones,
  setTransferPhones,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          Додаткові параметри
        </div>

        <div className={styles.subtitle}>
          Налаштуйте, що потрібно зберегти під час
          переведення
        </div>
      </div>

      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="checkbox"
            checked={keepResponsibleForMails}
            onChange={(e) =>
              setKeepResponsibleForMails(
                e.target.checked
              )
            }
          />

          <span className={styles.content}>
            <span className={styles.optionTitle}>
              Зберегти відповідальність за скриньки
            </span>

            <span className={styles.description}>
              Користувач залишиться відповідальним за
              свої колишні скриньки
            </span>
          </span>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={keepPhonesByPosition}
            onChange={(e) =>
              setKeepPhonesByPosition(
                e.target.checked
              )
            }
          />

          <span className={styles.content}>
            <span className={styles.optionTitle}>
              Залишити телефони за посадою
            </span>

            <span className={styles.description}>
              Телефони залишаться у старому підрозділі
              за допомогою технічного користувача
            </span>
          </span>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={transferPhones}
            onChange={(e) =>
              setTransferPhones(
                e.target.checked
              )
            }
          />

          <span className={styles.content}>
            <span className={styles.optionTitle}>
              Перенести телефони
            </span>

            <span className={styles.description}>
              Зберегти телефони за користувачем після
              переведення
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
