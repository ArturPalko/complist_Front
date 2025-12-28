import React, { useMemo } from "react";
import { connect } from "react-redux";

import {
  getGovUaMails,
  activeMenu,
  getLotusMails,
  getPhones,
  getSubFilters,
  GovUaCurrentPage,
  lotusCurrentPage,
  phonesCurrentPage,
  isFilterAppliedSelector,
  isPresentedFielterPanel
} from "../../../redux/selectors/selector";

import {
  getPhonesCount,
  getLotusCount,
  getGovUaCount
} from "../../../redux/selectors/selector.js";

import s from "../FilterPanel/FilterPanel.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckBox.jsx";
import CustomDropDown from "./CustomDropDown/CustomDropDown.jsx";

import {
  addFilter,
  clearCurrentForm,
  addIndexesOfFiltredResults
} from "../../../redux/selectors/filterData-reducer.js";

import { useFilters } from "../../../redux/hooks/useFilters.js";
import { countContacts } from "./countContacts.js";

// Утиліти для кількості контактів по меню
const getCountOfUsersByMenu = (state, menuName) => {
  if (menuName === "phones") return getPhonesCount(state).countOfUsers || 0;
  return 0;
};

const getCountOfMailsByMenu = (state, menuName) => {
  if (menuName.toLowerCase() === "lotus") return getLotusCount(state).countOfMails || 0;
  if (menuName.toLowerCase() === "gov-ua") return getGovUaCount(state).countOfMails || 0;
  return 0;
};

const FilterPanel = (props) => {
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
    getGovUaMails: props.getGovUaMails,
    getLotusMails: props.getLotusMails,
    getPhones: props.getPhones,
    getSubFilters: props.getSubFilters,
    addFilter: props.addFilter,
    clearCurrentForm: props.clearCurrentForm,
    addIndexesOfFiltredResults: props.addIndexesOfFiltredResults,
    GovUaCurrentPage: props.GovUaCurrentPage,
    lotusCurrentPage: props.lotusCurrentPage,
    phonesCurrentPage: props.phonesCurrentPage,
    isPresentedFielterPanel: props.isPresentedFielterPanel
  });

  const dataFromStore = useMemo(() => {
    switch (props.activeMenu.toLowerCase()) {
      case "gov-ua":
        return props.getGovUaMails;
      case "lotus":
        return props.getLotusMails;
      default:
        return props.getPhones;
    }
  }, [
    props.activeMenu,
    props.getGovUaMails,
    props.getLotusMails,
    props.getPhones
  ]);

  const contactsCount = useMemo(() => {
    if (!props.isFilterApplied) {
      switch (props.activeMenu.toLowerCase()) {
        case "phones":
          return getCountOfUsersByMenu(props.state, "phones");
        case "lotus":
          return getCountOfMailsByMenu(props.state, "lotus");
        case "gov-ua":
          return getCountOfMailsByMenu(props.state, "gov-ua");
        default:
          return 0;
      }
    }

    return countContacts({
      filteredChunks,
      dataByMenu: dataFromStore
    });
  }, [
    filteredChunks,
    dataFromStore,
    props.isFilterApplied,
    props.activeMenu,
    props.state
  ]);

  return (
    <div className={s.panel}>
      <div className={s.panelContent}>
        <div className={s.menu}>
          <h4>Записів: {contactsCount}</h4>
          <button onClick={handleOnClearFormButtonClick}>Скинути</button>
        </div>

        {Object.entries(groupedFilterPoints).map(([groupName, items]) => (
          <fieldset key={groupName}>
            <legend>{groupName}</legend>
            {items.map((item) => {
              const altKeys = getAlternativeKeys(item.key);
              const isDisabled = altKeys.some((alt) => currentFilters[alt]);

              return (
                <CustomCheckbox
                  key={item.key}
                  label={item.label}
                  checked={currentFilters[item.key] || false}
                  onChange={() => handleCheckboxChange(item.key)}
                  bgColor="white"
                  checkColor="black"
                  disabled={isDisabled}
                />
              );
            })}
          </fieldset>
        ))}

        {props.activeMenu.toLowerCase() === "phones" && (
          <CustomDropDown menus={phonesSubConditions} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const menu = activeMenu(state);

  return {
    state, // передаємо весь state для useMemo та підрахунку
    activeMenu: menu,
    getGovUaMails: getGovUaMails(state),
    getLotusMails: getLotusMails(state),
    getPhones: getPhones(state),
    getSubFilters: getSubFilters(state),
    GovUaCurrentPage: GovUaCurrentPage(state),
    lotusCurrentPage: lotusCurrentPage(state),
    phonesCurrentPage: phonesCurrentPage(state),
    isPresentedFielterPanel: isPresentedFielterPanel(state),
    isFilterApplied: isFilterAppliedSelector(menu)(state)
  };
};

const mapDispatchToProps = {
  addFilter,
  clearCurrentForm,
  addIndexesOfFiltredResults
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
