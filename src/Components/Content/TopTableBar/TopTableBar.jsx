import React from "react";
import { useTopTableBarLogic } from "../../../redux/hooks/useTopTableBarLogic";
import s from "./TopTableBar.module.css";
import CheckboxToggle from "./subComponent/CheckboxToggle";
import ActionsPanel from "./subComponent/ActionPanel/ActionPanel";

const TopTableBar = React.forwardRef(({ title, pageName }, ref) => {
  const {
    handleToggleSearchField,
    handleToggleEditMode,
    valueOfSearchCheckBox,
    valueOfpasswordCheckbox,
    valueOfEditCheckbox,
    handleTogglePasswords,
    showSearchToggle,
    showPasswordsToggle,
    showEditToggle,
    addPosition,
    editPosition,
    deletePosition
  } = useTopTableBarLogic(pageName);


  return (
    <div ref={ref} className={s.headerPanel}>
      <h2>{title}</h2>
      <ActionsPanel onAdd={addPosition} onDelete={deletePosition} onEdit={editPosition}/>
      <div className={s.buttonsBar}>
         {showEditToggle && (
          <CheckboxToggle
            checked={valueOfEditCheckbox}
            onChange={handleToggleEditMode}
            color="red"
            label="Редагувати"
          />
        )}
        
        {showSearchToggle && (
          <CheckboxToggle
            checked={valueOfSearchCheckBox}
            onChange={handleToggleSearchField}
            color="blue"
            label="Показати пошук"
          />
        )}

        {showPasswordsToggle && (
          <CheckboxToggle
            checked={valueOfpasswordCheckbox}
            onChange={handleTogglePasswords}
            color="green"
            label="Показати паролі"
          />
        )}

        
      </div>
    </div>
  );
});

export default TopTableBar;
