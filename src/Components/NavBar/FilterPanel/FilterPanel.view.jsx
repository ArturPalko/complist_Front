import React from "react";
import s from "./FilterPanel.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckBox.jsx";
import CustomDropDown from "./CustomDropDown/CustomDropDown.jsx";
import { Pages } from "../../../configs/constants.js";

const FilterPanelView = ({
  contactsCount,
  groupedFilterPoints,
  currentFilters,
  getAlternativeKeys,
  handleCheckboxChange,
  handleOnClearFormButtonClick,
  activeMenu,
  phonesSubConditions
}) => {
  return (
    <div className={s.panel}>
      <div className={s.panelContent}>
        <div className={s.menu}>
          <h4>Записів: {contactsCount}</h4>
          <button onClick={handleOnClearFormButtonClick}>Скинути</button>
        </div>

        {Object.entries(groupedFilterPoints).map(([groupName, items]) => (
          <fieldset key={groupName}>
            <legend>{groupName}</legend>

            {items.map((item) => {
              const altKeys = getAlternativeKeys(item.key);
              const isDisabled = altKeys.some(
                (alt) => currentFilters[alt]
              );

              return (
                <CustomCheckbox
                  key={item.key}
                  label={item.label}
                  checked={!!currentFilters[item.key]}
                  onChange={() => handleCheckboxChange(item.key)}
                  bgColor="white"
                  checkColor="black"
                  disabled={isDisabled}
                />
              );
            })}
          </fieldset>
        ))}

   {activeMenu === Pages.PHONES && (
  <CustomDropDown
    menus={phonesSubConditions}
    handleCheckboxChange={handleCheckboxChange} // передаємо з useFilters
    activeMenu={activeMenu}
  />
)}

      </div>
    </div>
  );
};

export default FilterPanelView;
