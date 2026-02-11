import React, { useState, useRef, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { activeMenu, getPositionsAndTypesOfUsers, getSubFilters } from "../../../../redux/selectors/selector";
import { setSubFilters } from "../../../../redux/reducers/filterData-reducer";
import CustomDropDownView from "./CustomDropDownView"

const CustomDropDownContainer = ({ positionsAndTypes, subFiltersFromStore, activeMenu: currentMenu, setSubFilters }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { contactTypes = [], userPositions: positions = [] } = positionsAndTypes || {};

  const predefinedGroups = ["Користувач", "Спеціалісти"];
  const others = useMemo(() => contactTypes.filter(t => !predefinedGroups.includes(t)), [contactTypes]);

  const selectedKeys = useMemo(() => {
    return Object.values(subFiltersFromStore || {})
      .flatMap(group => Object.entries(group || {})
        .filter(([, checked]) => checked)
        .map(([key]) => key)
      );
  }, [subFiltersFromStore]);

  const allSelectedPositions = positions.length > 0 && positions.every(p => selectedKeys.includes(p));
  const someSelectedPositions = positions.some(p => selectedKeys.includes(p));
  const allSelectedOthers = others.length > 0 && others.every(o => selectedKeys.includes(o));
  const someSelectedOthers = others.some(o => selectedKeys.includes(o));

  const togglePosition = (pos) => setSubFilters("phones", "userPosition", [pos], null);
  const toggleContactType = (type) => setSubFilters("phones", "contactType", [type], null);
  const toggleAllPositions = () => setSubFilters("phones", "userPosition", positions, !allSelectedPositions);
  const toggleAllOthers = () => setSubFilters("phones", "contactType", others, !allSelectedOthers);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <CustomDropDownView
      open={open}
      setOpen={setOpen}
      dropdownRef={dropdownRef}
      positions={positions}
      others={others}
      selectedKeys={selectedKeys}
      allSelectedPositions={allSelectedPositions}
      someSelectedPositions={someSelectedPositions}
      allSelectedOthers={allSelectedOthers}
      someSelectedOthers={someSelectedOthers}
      togglePosition={togglePosition}
      toggleContactType={toggleContactType}
      toggleAllPositions={toggleAllPositions}
      toggleAllOthers={toggleAllOthers}
    />
  );
};

const mapStateToProps = state => ({
  activeMenu: activeMenu(state),
  positionsAndTypes: getPositionsAndTypesOfUsers(state),
  subFiltersFromStore: getSubFilters(state)
});

const mapDispatchToProps = { setSubFilters };

export default connect(mapStateToProps, mapDispatchToProps)(CustomDropDownContainer);
