import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import "./CustomDropDown.module.css";
import { getPositionsAndTypesOfUsers } from "../../../../redux/selectors/selector";
import { addFilteredDataSubconditions } from "../../../../redux/selectors/filterData-reducer";

const CustomDropDown = (props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(props.initialSelected || []);
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

  // Оновлюємо subConditions у FilterPanel при зміні вибраних опцій
  useEffect(() => {
    const subConditions = selected.reduce((acc, type) => {
      acc[`userType_${type}`] = el => el.userType === type;
      return acc;
    }, {});
    props.setSubocnditions(subConditions);
  }, [selected, props]);

  const toggleSelection = (type) => {
    const newSelected = selected.includes(type)
      ? selected.filter(t => t !== type)
      : [...selected, type];

    setSelected(newSelected);
    props.addFilteredDataSubconditions(type); // запис у стор
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}>
        {selected.length ? selected.join(", ") : "Оберіть типи контактів"}
      </button>
      {open && (
        <div className="dropdown-menu">
          {optionsList.map(type => (
            <label key={type}>
              <input
                type="checkbox"
                checked={selected.includes(type)}
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
  getPositionsAndTypesOfUsers: getPositionsAndTypesOfUsers(state),
});

const mapDispatchToProps = { addFilteredDataSubconditions };

export default connect(mapStateToProps, mapDispatchToProps)(CustomDropDown);
