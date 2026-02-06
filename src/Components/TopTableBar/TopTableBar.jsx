import React from "react";
import { useTopTableBarLogic } from "../../redux/hooks/useTopTableBarLogic";
import s from "./TopTableBar.module.css";
import CheckboxToggle from "./subComponent/CheckboxToggle";

const TopTableBar = React.forwardRef(({ title, pageName }, ref) => {
  const {
    valueOfSearchCheckBox,
    handleToggleSearchField,
    valueOfpasswordCheckbox,
    handleTogglePasswords,
    showSearchToggle,
    showPasswordsToggle
  } = useTopTableBarLogic(pageName);

  return (
    <div ref={ref} className={s.headerPanel}>
      <h2>{title}</h2>
      <div className={s.buttonsBar}>
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
