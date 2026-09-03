import s from "./SaveCancelButtons.module.css";

export default function SaveCancelButtons({
  onCancel,
  onSave,
  isEdit,
  isSaving,
}) {
  return (
    <div className={s.buttons}>
      <button
        type="button"
        className={s.cancelButton}
        onClick={onCancel}
        disabled={isSaving}
      >
        Скасувати
      </button>

      <button
        type="button"
        className={s.saveButton}
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving
          ? "Збереження..."
          : isEdit
            ? "Зберегти"
            : "Додати"}
      </button>
    </div>
  );
}
