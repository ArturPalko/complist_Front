import { connect } from "react-redux";

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

const FilterPanelContainer = (props) => {
  const {
    currentFilters,
    filteredChunks,
    phonesSubConditions,
    handleCheckboxChange,
    handleOnClearFormButtonClick,
    groupedFilterPoints,
    getAlternativeKeys
  } = useFilters({
    activeMenu: props.activeMenu,
    dataForMenu: props.getDataForMenu,
    getSubFilters: props.getSubFilters,
    addFilter: props.addFilter,
    clearCurrentForm: props.clearCurrentForm,
    addIndexesOfFiltredResults: props.addIndexesOfFiltredResults,
    currentPage: props.currentPage,
    isPresentedFielterPanel: props.isPresentedFielterPanel
  });

const contactsCount = getContactsCount({
  state: props.state,
  activeMenu: props.activeMenu,
  isFilterApplied: props.isFilterApplied,
  filteredChunks,
  dataByMenu: props.getDataForMenu
});


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
