import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  getGovUaMails,
  activeMenu,
  getFilteredState,
  getLotusMails,
  getPhones,
  getPositionsAndTypesOfUsers,
  getSubFilters,
  GovUaCurrentPage,
  lotusCurrentPage,
  phonesCurrentPage
} from "../../../redux/selectors/selector";
import s from "../FilterPanel/FilterPanel.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckBox.jsx";
import { addFilter, clearCurrentForm, addIndexesOfFiltredResults } from "../../../redux/selectors/filterData-reducer.js";
import CustomDropDown from "./CustomDropDown/CustomDropDown.jsx";
import { isPresentedFielterPanel } from "../../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { useFilters } from "../../../redux/hooks/useFilters.js";


const FilterPanel = (props) => {
  const navigate = useNavigate();

  const {
    currentFilters,
    filteredChunks,
    phonesSubConditions,
    handleCheckboxChange,
    handleOnClearFormButtonClick,
    filterPoints,
    filterGroups,
    filterPointsForCurrentMenu,
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
    navigate,
    GovUaCurrentPage: props.GovUaCurrentPage,
    lotusCurrentPage: props.lotusCurrentPage,
    phonesCurrentPage: props.phonesCurrentPage,
    isPresentedFielterPanel:props.isPresentedFielterPanel
  });






 // if (!filteredChunks) return null; // безпечний захист від undefined

  return (
    <div className={s.panel}>
      <div className={s.panelContent}>
        <div className={s.menu}>
          <h4>
            Контактів: {filteredChunks.reduce((sum, chunk) => {
              const dataFromStore =
                props.activeMenu.toLowerCase() === "gov-ua"
                  ? props.getGovUaMails
                  : props.activeMenu.toLowerCase() === "lotus"
                  ? props.getLotusMails
                  : props.getPhones;

              const minus = chunk.rows.filter(pos => {
                const row = dataFromStore?.[pos.page - 1]?.rows?.[pos.index];
                return row?.type === "section" || row?.type === "department";
              }).length;

              return sum + (chunk.rows.length - minus);
            }, 0)}
          </h4>
          <button onClick={handleOnClearFormButtonClick}>Скинути</button>
        </div>

        {Object.entries(groupedFilterPoints).map(([groupName, items]) => (
          <fieldset key={groupName}>
            <legend>{groupName}</legend>
            {items.map(item => {
              const altKeys = getAlternativeKeys(item.key);
              const isDisabled = altKeys.some(alt => currentFilters[alt]);
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

        {props.activeMenu === "phones" && (
          <CustomDropDown
            menus={phonesSubConditions}
          />
        )}
      </div>
    </div>
  );
};


const mapStateToProps = state => ({
  activeMenu: activeMenu(state),
  getGovUaMails: getGovUaMails(state),
  getLotusMails: getLotusMails(state),
  getPhones: getPhones(state),
  getFilteredState: menu => getFilteredState(state, menu),
  getPositionsAndTypesOfUsers: getPositionsAndTypesOfUsers(state),
  getSubFilters: getSubFilters(state),
  GovUaCurrentPage: GovUaCurrentPage(state),
  lotusCurrentPage: lotusCurrentPage(state),
  phonesCurrentPage: phonesCurrentPage(state),
  isPresentedFielterPanel:isPresentedFielterPanel(state)
});

const mapDispatchToProps = { addFilter, clearCurrentForm, addIndexesOfFiltredResults };

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
