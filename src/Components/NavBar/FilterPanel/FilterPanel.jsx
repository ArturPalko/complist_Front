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
  isPresentedFielterPanel,
  getCountOfUsers,
  getCountOfMails
} from "../../../redux/selectors/selector";

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
      if (props.activeMenu.toLowerCase() === "phones") {
        let a = props.getCountOfUsers("phones");
        return a
      } else if (props.activeMenu.toLowerCase() === "lotus") {
        return props.getCountOfMails("Lotus");
      } else if (props.activeMenu.toLowerCase() === "gov-ua") {
        return props.getCountOfMails("Gov-ua");
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
    props.getCountOfUsers,
    props.getCountOfMails
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
    activeMenu: menu,
    getGovUaMails: getGovUaMails(state),
    getLotusMails: getLotusMails(state),
    getPhones: getPhones(state),
    getSubFilters: getSubFilters(state),
    GovUaCurrentPage: GovUaCurrentPage(state),
    lotusCurrentPage: lotusCurrentPage(state),
    phonesCurrentPage: phonesCurrentPage(state),
    isPresentedFielterPanel: isPresentedFielterPanel(state),
    isFilterApplied: isFilterAppliedSelector(menu)(state),
    getCountOfUsers: (menuName) => getCountOfUsers(state, menuName),
    getCountOfMails: (menuName) => getCountOfMails(state, menuName)
  };
};

const mapDispatchToProps = {
  addFilter,
  clearCurrentForm,
  addIndexesOfFiltredResults
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
