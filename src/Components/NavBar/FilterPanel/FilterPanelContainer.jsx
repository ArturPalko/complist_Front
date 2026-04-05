import { connect } from "react-redux";
import { handleCheckboxChangeHelper } from "../../../redux/hooks/useFilters/useFiltersFunctions/handlers/handleOnCheckboxChange.js";
import { useDispatch } from "react-redux";

import {
  activeMenu,
  getSubFilters,
  currentPageByMenu,
  isFilterAppliedSelector,
  isPresentedFielterPanel,
  getDataForMenu,
  getContactsCount
} from "../../../redux/selectors/selector.js";

import {
  addFilter,
  clearCurrentForm,
  addIndexesOfFiltredResults
} from "../../../redux/reducers/filterData-reducer.js";

import { useFilters } from "../../../redux/hooks/useFilters/useFilters.js";
import FilterPanelView from "./FilterPanel.view";
import { clearFormHelper } from "../../../redux/hooks/useFilters/useFiltersFunctions/handlers/handleOnClearFormButtonClick.js";


const FilterPanelContainer = (props) => {
  const dispatch = useDispatch();
  const {
    currentFilters,
    filteredChunks,
    phonesSubConditions,
    groupedFilterPoints,
    getAlternativeKeys,
    activeMenu
  } = useFilters({});

const contactsCount = getContactsCount({
  state: props.state,
  activeMenu: props.activeMenu,
  isFilterApplied: props.isFilterApplied,
  filteredChunks,
  dataByMenu: props.getDataForMenu
});

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
      activeMenu={props.activeMenu}
      phonesSubConditions={phonesSubConditions}
    />
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);

  return {
    state,
    activeMenu: menu,
    getSubFilters: getSubFilters(state),
    currentPage: currentPageByMenu(state, menu),
    isPresentedFielterPanel: isPresentedFielterPanel(state),
    isFilterApplied: isFilterAppliedSelector(menu)(state),
    getDataForMenu: getDataForMenu(state, menu)
  };
};

const mapDispatchToProps = {
  addFilter,
  clearCurrentForm,
  addIndexesOfFiltredResults
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPanelContainer);
