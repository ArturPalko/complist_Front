import React from "react";
import { useSearchToggle, usePasswordsToggle } from "../../redux/hooks/hooks.js";
import s from "./TopTableBar.module.css";

const TopTableBar = React.forwardRef(({ title, mailType }, ref) => {
  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();

  return (
    <div ref={ref} className={s.headerPanel}>
      <h2>{title}</h2>
      <div className={s.buttonsBar}>
        <div className={s.switchWrapper}>
          <div>
            <label className={s.switch}>
              <input
                type="checkbox"
                checked={valueOfSearchCheckBox}
                onChange={handleToggleSearchField}
              />
              <span className={`${s.slider} ${s.blue}`}></span>
            </label>
          </div>
          <div className={s.sliderDesc}>
            <span>Показати пошук</span>
          </div>
        </div>

        {(mailType === "Lotus" || mailType === "Gov-ua") && (
          <div className={s.switchWrapper}>
            <div>
              <label className={s.switch}>
                <input
                  type="checkbox"
                  onChange={handleTogglePasswords}
                  checked={valueOfpasswordCheckbox}
                />
                <span className={`${s.slider} ${s.green}`}></span>
              </label>
            </div>
            <div className={s.sliderDesc}>
              <span>Показати паролі</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default TopTableBar;
