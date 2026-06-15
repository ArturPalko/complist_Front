import ActionButton from "./ActionButton/ActionButton";
import s from "./ActionPanel.module.css";
import { useDragContext } from "../../../../../redux/contexts/useConetxt";

export default function ActionsPanel({
  onAdd,
  onEdit,
  onDelete,
}) {
  const { selectedIds } = useDragContext();

  return (
    <div className={s.panel}>
      <ActionButton onClick={onAdd}>
        ➕ Додати
      </ActionButton>

      <ActionButton onClick={() => onEdit(selectedIds)}>
        ✏️ Редагувати
      </ActionButton>

      <ActionButton onClick={() => onDelete(selectedIds)}>
        🗑 Видалити
      </ActionButton>
    </div>
  );
}