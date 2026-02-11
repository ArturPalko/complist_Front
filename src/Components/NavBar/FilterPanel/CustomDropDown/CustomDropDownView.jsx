import React from "react";
import s from "./CustomDropDown.module.css"

const CustomDropDownView = ({
  open,
  setOpen,
  dropdownRef,
  positions,
  others,
  selectedKeys,
  allSelectedPositions,
  someSelectedPositions,
  allSelectedOthers,
  someSelectedOthers,
  togglePosition,
  toggleContactType,
  toggleAllPositions,
  toggleAllOthers
}) => {
  return (
    <div className={s.dropdownContainer} ref={dropdownRef}>
      <button className={s.dropdownToggle} onClick={() => setOpen(!open)}>
        {selectedKeys.length === 0
          ? "Обрати значення"
          : [
              positions.some(pos => selectedKeys.includes(pos)) ? "Користувач" : null,
              ...selectedKeys.filter(k => !positions.includes(k))
            ].filter(Boolean).join(", ")}
      </button>

      {open && (
        <div className={s.dropdownMenuContainer}>
          {/* Верхнє вікно: Посади */}
          <div className={s.dropdownMenuUpper}>
            <fieldset className={s.group}>
              <legend className={s.legend}>Типи посад</legend>
              {positions.map(pos => (
                <label key={pos} className={s.dropdownItem}>
                  <input type="checkbox" checked={selectedKeys.includes(pos)} onChange={() => togglePosition(pos)} />
                  {pos}
                </label>
              ))}
            </fieldset>
          </div>

          {/* Нижнє вікно: Користувачі */}
          <div className={s.dropdownMenuLower}>
            <fieldset className={s.group}>
              <legend className={s.legend}>Типи користувачів</legend>
              <div className={s.dropdownMenuGroup}>
                <label className={s.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={allSelectedPositions}
                    ref={el => { if (el) el.indeterminate = !allSelectedPositions && someSelectedPositions; }}
                    onChange={toggleAllPositions}
                  />
                  Користувач
                </label>

                <label className={s.dropdownItem}>
                  <input type="checkbox" checked={selectedKeys.includes("Спеціалісти")} onChange={() => toggleContactType("Спеціалісти")} />
                  Спеціалісти
                </label>
              </div>

              <label className={s.dropdownItem}>
                <input
                  type="checkbox"
                  checked={allSelectedOthers}
                  ref={el => { if (el) el.indeterminate = !allSelectedOthers && someSelectedOthers; }}
                  onChange={toggleAllOthers}
                />
                Інше
              </label>
            </fieldset>

            <fieldset className={s.group}>
              <legend className={s.legend}>Інше</legend>
              {others.map(value => (
                <label key={value} className={s.dropdownItem}>
                  <input type="checkbox" checked={selectedKeys.includes(value)} onChange={() => toggleContactType(value)} />
                  {value}
                </label>
              ))}
            </fieldset>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropDownView;
