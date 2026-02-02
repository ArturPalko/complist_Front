// src/redux/hooks/useFiltersHandlers/handleOnClearFormButtonClick.js
export const handleOnClearFormButtonClickHandler = ({
  activeMenu,
  setLotusFilters,
  setGovUaFilters,
  setPhonesFilters,
  setPhonesSubConditions,
  clearCurrentForm,
  redirectToCurrentPage
}) => {
  if (activeMenu === "Lotus") setLotusFilters({});
  if (activeMenu === "Gov-ua") setGovUaFilters({});
  if (activeMenu === "phones") {
    setPhonesFilters({});
    setPhonesSubConditions({});
  }

  if (typeof clearCurrentForm === "function") clearCurrentForm(activeMenu);

  redirectToCurrentPage({}, {});
};
