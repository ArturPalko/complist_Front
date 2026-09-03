import form from "../../../../shared/Css/form.module.css";
import s from "./ChangeUserStatusView.module.css";

export default function ChangeUserStatusView({
  onConfirm,
  onClose,
  error,
  isSaving,
}) {
  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.header}>
          <div>
            <div className={s.title}>
              Зміна статусу
            </div>

            <div className={s.subtitle}>
              Керування статусом користувачів
            </div>
          </div>

          <button
            type="button"
            className={s.close}
            onClick={onClose}
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        <div className={s.content}>
          <div className={s.question}>
            Після відключення користувач:
          </div>

          <div className={s.description}>
            <ul>
              <li>
                не відображатиметься в таблиці «Телефони»,
                але всі його поточні зв’язки з телефонами
                будуть збережені;
              </li>
              <li>
                його персональні поштові скриньки
                не відображатимуться в системі;
              </li>
              <li>
                він не відображатиметься у переліку
                відповідальних осіб для поштових скриньок,
                у яких його призначено.
              </li>
            </ul>

            <p className={s.note}>
              Користувач не видаляється із системи.
              Його дані та збережені зв’язки залишаються
              в системі й будуть знову доступні після
              повторного увімкнення.
            </p>
          </div>

          {error && (
            <div className={form.error}>
              {error}
            </div>
          )}
        </div>

        <div className={s.footer}>
          <button
            type="button"
            className={s.cancelButton}
            onClick={onClose}
            disabled={isSaving}
          >
            Скасувати
          </button>

          <button
            type="button"
            className={s.confirmButton}
            onClick={onConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Збереження..." : "Змінити статус"}
          </button>
        </div>
      </div>
    </div>
  );
}

