import React from "react";
import { useTopTableBarLogic } from "../../../redux/hooks/useTopTableBarLogic";
import s from "./TopTableBar.module.css";
import CheckboxToggle from "./subComponent/CheckboxToggle";
import ActionsPanel from "./subComponent/ActionPanel/ActionPanel";
import { useSelector } from "react-redux";
import { activeMenu, getCurrentMode, isEditModeSelected } from "../../../redux/selectors/selector";

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
    add,
    edit,
    remove
  } = useTopTableBarLogic(pageName);

  const moder = useSelector(isEditModeSelected)
  const menu = useSelector(activeMenu);
  const editMode = useSelector(getCurrentMode);
  const showEditPanel = moder && menu == "phones" && editMode

  return (
    <div ref={ref} className={s.headerPanel}>
      <h2>{title}</h2>
      {showEditPanel && <ActionsPanel onAdd={add} onDelete={remove} onEdit={edit}/>}
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
