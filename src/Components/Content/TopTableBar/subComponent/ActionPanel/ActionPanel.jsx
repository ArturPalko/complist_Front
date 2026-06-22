import ActionButton from "./ActionButton/ActionButton";
import s from "./ActionPanel.module.css";
import { useDragContext } from "../../../../../redux/contexts/useConetxt";
import { useSelector } from "react-redux";
import { isUserTypesMode } from "../../../../../redux/selectors/selector";

export default function ActionsPanel({
  onAdd,
  onEdit,
  onDelete,
}) {
  const { selectedIds } = useDragContext();
  const disabled = useSelector(isUserTypesMode);

  return (
    <div className={s.panel}>
      <ActionButton disabled={disabled} onClick={onAdd}>
        ➕ Додати
      </ActionButton>

      <ActionButton disabled={disabled}  onClick={() => onEdit(selectedIds)}>
        ✏️ Редагувати
      </ActionButton>

      <ActionButton disabled={disabled} onClick={() => onDelete(selectedIds)}>
        🗑 Видалити
      </ActionButton>
    </div>
  );
}