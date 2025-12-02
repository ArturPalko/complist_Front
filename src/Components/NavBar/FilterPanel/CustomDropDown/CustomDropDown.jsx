import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import "./CustomDropDown.module.css";
import { activeMenu, getPositionsAndTypesOfUsers, getSubFilters } from "../../../../redux/selectors/selector";
import { addFilteredDataSubconditions } from "../../../../redux/selectors/filterData-reducer";

const CustomDropDown = (props) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const optionsList = props.getPositionsAndTypesOfUsers || [];

  // Закриття дропдауну при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (type) => {
    props.addFilteredDataSubconditions(type); // оновлюємо стор
  
  };

  // перетворюємо об’єкт subFilters у масив вибраних ключів
  const selectedKeys = Object.keys(props.subFiltersFromStore || {}).filter(
    (key) => props.subFiltersFromStore[key]
    
  );

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>
        {selectedKeys.length
          ? selectedKeys.join(", ")
          : "Оберіть типи контактів"}
      </button>
      {open && (
        <div className="dropdown-menu">
          {optionsList.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={selectedKeys.includes(type)}
                onChange={() => toggleSelection(type)}
              />
              {type}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  getPositionsAndTypesOfUsers: getPositionsAndTypesOfUsers(state),
  subFiltersFromStore: getSubFilters(state), // об’єкт
});

const mapDispatchToProps = { addFilteredDataSubconditions };

export default connect(mapStateToProps, mapDispatchToProps)(CustomDropDown);
