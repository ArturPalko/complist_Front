import s from "./FormButtons.module.css";

export default function FormButtons({
  onCancel,
  onSave,
  isEdit,
}) {
  return (
    <div className={s.buttons}>
      <button
        className={s.cancelButton}
        onClick={onCancel}
      >
        Скасувати
      </button>

      <button
        className={s.saveButton}
        onClick={onSave}
      >
        {isEdit ? "Зберегти" : "Додати"}
      </button>
    </div>
  );
}