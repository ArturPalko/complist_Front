import React from "react";

const CustomRadioGroup = ({ groupName, name, labels }) => {
  return (
    <fieldset>
      <legend>{groupName}</legend>
      {labels.map((label, index) => (
        <label key={index}>
          <input type="radio" name={name} value={label} /> {label}
        </label>
      ))}
    </fieldset>
  );
};

export default CustomRadioGroup;
