import React from "react";
import s from "../TopTableBar.module.css";

const CheckboxToggle = ({ checked, onChange, color, label }) => {
  return (
    <div className={s.switchWrapper}>
      <label className={s.switch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={`${s.slider} ${s[color]}`}></span>
      </label>
      <div className={s.sliderDesc}>{label}</div>
    </div>
  );
};

export default CheckboxToggle;
