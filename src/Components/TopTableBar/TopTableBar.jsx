import React from "react";
import { useTopTableBarState } from "../../redux/hooks/useTopTableLogic";
import s from "./TopTableBar.module.css";

const TopTableBar = React.forwardRef(({ title, mailType }, ref) => {
  const {
    valueOfSearchCheckBox,
    handleToggleSearchField,
    valueOfpasswordCheckbox,
    handleTogglePasswords,
    showPasswordsToggle
  } = useTopTableBarState(mailType);

  return (
    <div ref={ref} className={s.headerPanel}>
      <h2>{title}</h2>
      <div className={s.buttonsBar}>
        <div className={s.switchWrapper}>
          <label className={s.switch}>
            <input
              type="checkbox"
              checked={valueOfSearchCheckBox}
              onChange={handleToggleSearchField}
            />
            <span className={`${s.slider} ${s.blue}`}></span>
          </label>
          <div className={s.sliderDesc}>Показати пошук</div>
        </div>

        {showPasswordsToggle && (
          <div className={s.switchWrapper}>
            <label className={s.switch}>
              <input
                type="checkbox"
                onChange={handleTogglePasswords}
                checked={valueOfpasswordCheckbox}
              />
              <span className={`${s.slider} ${s.green}`}></span>
            </label>
            <div className={s.sliderDesc}>Показати паролі</div>
          </div>
        )}
      </div>
    </div>
  );
});

export default TopTableBar;
