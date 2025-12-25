export const handleOnCheckboxChangeHandler = ({
  key,
  activeMenu,
  lotusFilters,
  setLotusFilters,
  govUaFilters,
  setGovUaFilters,
  phonesFilters,
  setPhonesFilters,
  setPhonesSubConditions,
  phonesSubConditions,
  addFilter,
  redirectToCurrentPage,
  hasAnyFilters,
  clearCurrentForm
}) => {
  let currentFilters;
  let setFiltersFn;

  if (activeMenu === "Lotus") {
    currentFilters = lotusFilters;
    setFiltersFn = setLotusFilters;
  } else if (activeMenu === "Gov-ua") {
    currentFilters = govUaFilters;
    setFiltersFn = setGovUaFilters;
  } else {
    currentFilters = phonesFilters;
    setFiltersFn = setPhonesFilters;
  }

  const newFilters = { ...currentFilters, [key]: !currentFilters[key] };
  const anyFiltersLeft = hasAnyFilters(newFilters, phonesSubConditions);
debugger;
  if (anyFiltersLeft==false) {
  
    setFiltersFn({});
    if (activeMenu === "phones") setPhonesSubConditions({});
    clearCurrentForm?.(activeMenu);
    redirectToCurrentPage?.({}, phonesSubConditions);
    debugger;
    return;
  }

  setFiltersFn(newFilters);

  // Диспатч
  addFilter(activeMenu, key);

  // Редірект
  redirectToCurrentPage?.(newFilters, phonesSubConditions);
};
