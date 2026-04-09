import FilterPanelView from "./FilterPanel.view";
import { useFilterPanelLogic } from "../../../redux/hooks/useFilterPanelLogic";
import { handleCheckboxChangeHelper } from "../../../redux/hooks/useFilters/useFiltersFunctions/handlers/handleOnCheckboxChange";
import { clearFormHelper } from "../../../redux/hooks/useFilters/useFiltersFunctions/handlers/handleOnClearFormButtonClick";
import { useDispatch } from "react-redux";

const FilterPanelContainer = () => {
  const dispatch = useDispatch();
  const {
    contactsCount,
    groupedFilterPoints,
    currentFilters,
    getAlternativeKeys,
    activeMenu,
    phonesSubConditions
  } = useFilterPanelLogic();

  // використовуємо activeMenu з hooks, більше не menu
  const handleCheckboxChange = (key, category) =>
    handleCheckboxChangeHelper({ activeMenu, key, category, dispatch });

  const handleOnClearFormButtonClick = () =>
    clearFormHelper({ activeMenu, dispatch });

  return (
    <FilterPanelView
      contactsCount={contactsCount}
      groupedFilterPoints={groupedFilterPoints}
      currentFilters={currentFilters}
      getAlternativeKeys={getAlternativeKeys}
      handleCheckboxChange={handleCheckboxChange}
      handleOnClearFormButtonClick={handleOnClearFormButtonClick}
      activeMenu={activeMenu}
      phonesSubConditions={phonesSubConditions}
    />
  );
};

export default FilterPanelContainer;