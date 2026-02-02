import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import s from "./CustomDropDown.module.css";
import { activeMenu, getPositionsAndTypesOfUsers, getSubFilters } from "../../../../redux/selectors/selector";
import { addFilteredDataSubconditions } from "../../../../redux/reducers/filterData-reducer";

const CustomDropDown = (props) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const { contactTypes = [], userPositions: positions = [] } = props.positionsAndTypes || [];

  const predefinedGroups = ["Користувач", "Спеціалісти"];
  const others = contactTypes.filter(type => !predefinedGroups.includes(type));

  // Всі обрані ключі з сабфільтрів
  const selectedKeys = Object.values(props.subFiltersFromStore || {})
    .flatMap(group => Object.entries(group)
      .filter(([, isChecked]) => isChecked)
      .map(([key]) => key)
    );

  // --- Toggle для одиночного чекбокса ---
  const toggleItem = (value, variety) => {
    props.addFilteredDataSubconditions(value, variety);
   
  };

  // --- Верхнє вікно: Посади ---
  const togglePosition = (pos) => {
    toggleItem(pos, "userPosition");
  };

  // --- Нижнє вікно: Користувачі ---
  const toggleContactType = (type) => {
    toggleItem(type, "contactType");
  };

  // Груповий чекбокс “Інше”
  const allSelectedPositions = positions.every(p=> selectedKeys.includes(p));
  const someSelectedPositions = positions.some(p=> selectedKeys.includes(p));
  const allSelectedOthers = others.every(o => selectedKeys.includes(o));
  const someSelectedOthers = others.some(o => selectedKeys.includes(o));

  const toggleAllPositions =()=>{
    positions.forEach(p => {
      if (allSelectedPositions) {
        if (selectedKeys.includes(p)) togglePosition(p);
      } else {
        if (!selectedKeys.includes(p)) togglePosition(p);
      }
    });
  };
  
  const toggleAllOthers = () => {
    others.forEach(o => {
      if (allSelectedOthers) {
        if (selectedKeys.includes(o)) toggleContactType(o);
      } else {
        if (!selectedKeys.includes(o)) toggleContactType(o);
      }
    });
  };

  // --- Закриття дропдауну при кліку поза ним ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className={s.dropdownContainer} ref={dropdownRef}>
      <button className={s.dropdownToggle} onClick={() => setOpen(!open)}>
        {selectedKeys.length === 0
  ? "Обрати значення"
  : [
      positions.some(pos => selectedKeys.includes(pos)) ? "Користувач" : null,
      ...selectedKeys.filter(k => !positions.includes(k))
    ]
      .filter(Boolean)
      .join(", ")}

      </button>

      {open && (
        <div className={s.dropdownMenuContainer}>

          {/* Верхнє вікно: Посади */}
          <div className={s.dropdownMenuUpper}>
            <fieldset className={s.group}>
              <legend className={s.legend}>Типи посад</legend>
              {positions.map(pos => (
                <label key={pos} className={s.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(pos)}
                    onChange={() => togglePosition(pos)}
                  />
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
     // checked={selectedKeys.includes("Користувач")}
      //onChange={() => togglePosition(value)}
         checked={allSelectedPositions}
                  ref={el => { if (el) el.indeterminate = !allSelectedPositions && someSelectedPositions; }}
                  onChange={toggleAllPositions}
    />
    Користувач
  </label>

  <label className={s.dropdownItem}>
    <input
      type="checkbox"
      checked={selectedKeys.includes("Спеціалісти")}
      onChange={() => toggleItem("Спеціалісти", "contactType")}
    />
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
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(value)}
                    onChange={() => toggleContactType(value)}
                  />
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

const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  positionsAndTypes: getPositionsAndTypesOfUsers(state),
  subFiltersFromStore: getSubFilters(state),
});

const mapDispatchToProps = { addFilteredDataSubconditions };

export default connect(mapStateToProps, mapDispatchToProps)(CustomDropDown);
