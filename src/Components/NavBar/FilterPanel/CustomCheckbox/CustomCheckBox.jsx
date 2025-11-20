import React from "react";
import s from "./CustomCheckBox.module.css"

const CustomCheckbox = ({ label, bgColor = "white", checkColor = "white", checked, onChange,disabled }) => {
  return (
  <label className={s.customCheckbox}>
  <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
  <span className={s.checkboxSpan} style={{ backgroundColor: bgColor, "--check-color": checkColor }}></span>
  <span className={s.labelText}>{label}</span>
</label>

  );
};

export default CustomCheckbox;
