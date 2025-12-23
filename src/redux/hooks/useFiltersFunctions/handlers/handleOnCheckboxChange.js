// src/redux/hooks/useFiltersHandlers/handleCheckboxChange.js
export const handleOnCheckboxChangeHandler = ({
  key,
  activeMenu,
  lotusFilters,
  setLotusFilters,
  govUaFilters,
  setGovUaFilters,
  phonesFilters,
  setPhonesFilters,
  phonesSubConditions,
  addFilter,
  redirectToCurrentPage
}) => {
  if (activeMenu === "Lotus") {
    setLotusFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters);
      return newFilters;
    });
  } else if (activeMenu === "Gov-ua") {
    setGovUaFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters);
      return newFilters;
    });
  } else {
    setPhonesFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters, phonesSubConditions);
      return newFilters;
    });
  }

  if (activeMenu && key) {
    addFilter(activeMenu, key);
  }
  debugger;
};
