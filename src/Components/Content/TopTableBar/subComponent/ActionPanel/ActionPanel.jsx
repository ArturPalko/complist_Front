import ActionButton from "./ActionButton/ActionButton";
import s from "./ActionPanel.module.css";

export default function ActionsPanel({
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className={s.panel}>
      <ActionButton onClick={onAdd}>
        ➕ Додати
      </ActionButton>

      <ActionButton onClick={onEdit}>
        ✏️ Редагувати
      </ActionButton>

      <ActionButton onClick={onDelete}>
        🗑 Видалити
      </ActionButton>
    </div>
  );
}