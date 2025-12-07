import React, { useState, useEffect } from "react";
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

const CHUNK_SIZE = 18;

const FilterPanel = (props) => {
  const navigate = useNavigate();

  // Локальні стейти для чекбоксів
  const [lotusFilters, setLotusFilters] = useState({});
  const [govUaFilters, setGovUaFilters] = useState({});
  const [phonesFilters, setPhonesFilters] = useState({});
 // Локальний стейт для саб-умов phones
const [phonesSubConditions, setPhonesSubConditions] = useState([]);


  // Визначаємо умови для всіх фільтрів
  const conditions = {
    personalMails: (el) => el.ownerType === "User",
    departmentMails: (el) => el.ownerType === "Department",
    sectionMails: (el) => el.ownerType === "Section",
    hasResponsible: (el) => el.responsibleUser !== "",
    passwordKnown: (el) => el.passwordKnown === true,
    hasPrevioustName: (el) => el.previousName !== "",
    hasNoResponsible: (el) => el.responsibleUser === "",
    hasNewPostName: (el) => el.name != null,
    passwordUnKnown: (el) => el.passwordKnown === false,
    NOThasNewPostName: (el) => el.name == null,
    NOThasPrevioustName: (el) => el.previousName === "",
    hasLandlinePhone: (el) => el.phones?.some(p => p.phoneType === "Міський"),
    NOThasLandlinePhone: (el) => !el.phones?.some(p => p.phoneType === "Міський"),
    hasInternalPhone: (el) => el.phones?.some(p => p.phoneType === "Внутрішній"),
    NOThasInternalPhone: (el) => !el.phones?.some(p => p.phoneType === "Внутрішній"),
    hasCiscoPhone: (el) => el.phones?.some(p => p.phoneType === "IP (Cisco)"),
    NOThasCiscoPhone: (el) => !el.phones?.some(p => p.phoneType === "IP (Cisco)"),
  };

  const filterGroups = {
    personalMails: ["departmentMails", "sectionMails"],
    hasResponsible: ["hasNoResponsible"],
    passwordKnown: ["passwordUnKnown"],
    hasNewPostName: ["NOThasNewPostName"],
    hasPrevioustName: ["NOThasPrevioustName"],
    hasLandlinePhone: ["NOThasLandlinePhone"],
    hasInternalPhone: ["NOThasInternalPhone"],
    hasCiscoPhone: ["NOThasCiscoPhone"]
  };

  const filterPoints = [
    { pages: ["gov-ua", "lotus"], groupName: "Власник", key: "personalMails", label: "Персональні" },
    { pages: ["gov-ua", "lotus"], groupName: "Власник", key: "departmentMails", label: "Самостійного підрозділу" },
    { pages: ["gov-ua", "lotus"], groupName: "Власник", key: "sectionMails", label: "(Не) самостійного підрозділу" },
    { pages: ["gov-ua"], groupName: "Позитивна властивість", key: "hasResponsible", label: "Має відповідальну особу" },
    { pages: ["lotus"], groupName: "Позитивна властивість", key: "hasNewPostName", label: "Має нову назву" },
    { pages: ["lotus"], groupName: "Позитивна властивість", key: "hasPrevioustName", label: "Має стару назву" },
    { pages: ["gov-ua", "lotus"], groupName: "Позитивна властивість", key: "passwordKnown", label: "Пароль відомий" },
    { pages: ["gov-ua"], groupName: "Негативна властивість", key: "hasNoResponsible", label: "(Не) має відповідальну особу" },
    { pages: ["lotus"], groupName: "Негативна властивість", key: "NOThasNewPostName", label: "(Не) має нову назву" },
    { pages: ["lotus"], groupName: "Позитивна властивість", key: "NOThasPrevioustName", label: "(Не) має стару назву" },
    { pages: ["gov-ua", "lotus"], groupName: "Негативна властивість", key: "passwordUnKnown", label: "Пароль не відомий" },
    { pages: ["phones"], groupName: "Позитивна властивість", key: "hasLandlinePhone", label: "має Міський телефон" },
    { pages: ["phones"], groupName: "Позитивна властивість", key: "hasInternalPhone", label: "має Внутрішній телефон" },
    { pages: ["phones"], groupName: "Позитивна властивість", key: "hasCiscoPhone", label: "має IP Cisco телефон" },
    { pages: ["phones"], groupName: "Негативна властивість", key: "NOThasLandlinePhone", label: "(НЕ) має Міський телефон" },
    { pages: ["phones"], groupName: "Негативна властивість", key: "NOThasInternalPhone", label: "(НЕ) має Внутрішній телефон" },
    { pages: ["phones"], groupName: "Негативна властивість", key: "NOThasCiscoPhone", label: "(НЕ) має IP Cisco телефон" },
  ];

  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) => filterGroups[k].includes(key));
    return [...direct, ...reverse];
  };

  const passesFiltersForRow = (row, activeFilters = [], subConditions = {}) => {
    const checkRowOrUser = (el) => {
      const filtersPass = activeFilters.length > 0
        ? activeFilters.every(f => typeof conditions[f] === "function" && conditions[f](el))
        : true;

      const subConditionsPass = Object.values(subConditions).some(groupObj => Object.keys(groupObj).length > 0)
        ? Object.values(subConditions).some(groupObj =>
            Object.values(groupObj).some(condFn => condFn(el))
          )
        : true;

      return filtersPass && subConditionsPass;
    };

    if (row.type === "department") {
      const usersPass = row.users?.some(checkRowOrUser) || false;
      const sectionsPass = row.sections?.some(section =>
        section.users?.length > 0 && section.users.some(checkRowOrUser)
      ) || false;
      return usersPass || sectionsPass;
    }

    if (row.type === "section") {
      return row.users?.length > 0 && row.users.some(checkRowOrUser);
    }

    return checkRowOrUser(row);
  };

  const computeFilteredChunks = (state, subConditions) => {
    const activeFilters = Object.entries(state)
      .filter(([key, v]) => v && conditions[key])
      .map(([key]) => key);

    const dataFromStore =
      props.activeMenu.toLowerCase() === "gov-ua"
        ? props.getGovUaMails || []
        : props.activeMenu.toLowerCase() === "lotus"
          ? props.getLotusMails || []
          : props.getPhones || [];

    const allFilteredIndexes = [];

    dataFromStore.forEach((element, pageIndex) => {
      element.rows.forEach((row, rowIndex) => {
        if (passesFiltersForRow(row, activeFilters, subConditions)) {
          allFilteredIndexes.push({ page: pageIndex + 1, index: rowIndex, type: row.type });
        }
      });
    });

    const chunks = [];
    for (let i = 0; i < allFilteredIndexes.length; i += CHUNK_SIZE) {
      chunks.push({ pageIndex: chunks.length + 1, rows: allFilteredIndexes.slice(i, i + CHUNK_SIZE) });
    }

    return chunks;
  };

  const navigateToPage = (page) => {
    let basePath;
    switch (props.activeMenu) {
      case "Gov-ua": basePath = "/mails/Gov-ua/"; break;
      case "Lotus": basePath = "/mails/Lotus/"; break;
      case "phones": basePath = "/phones/"; break;
      default: basePath = "/"; break;
    }
    navigate(basePath + page);
  };

  // Обираємо активний стейт залежно від меню
  const currentFilters = 
    props.activeMenu === "Lotus" ? lotusFilters :
    props.activeMenu === "Gov-ua" ? govUaFilters :
    phonesFilters;

  // Зміна чекбоксу для поточного меню
  const handleCheckboxChange = (key) => {
    if (props.activeMenu === "Lotus") {
      setLotusFilters(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (props.activeMenu === "Gov-ua") {
      setGovUaFilters(prev => ({ ...prev, [key]: !prev[key] }));
    } else {
      // phones
      setPhonesFilters(prev => ({ ...prev, [key]: !prev[key] }));
    }
      props.addFilter(props.activeMenu, key);
  };

  // Саб-умови для phones
  const handlePhoneSubMenuChange = (subMenuKey, itemKey, isChecked) => {
    setPhonesSubConditions(prev => {
      const newSub = { ...prev };
      if (!newSub[subMenuKey]) newSub[subMenuKey] = {};
      if (isChecked) {
        newSub[subMenuKey][itemKey] = (el) => {
          if (subMenuKey === "contactType") return el.userType === itemKey;
          if (subMenuKey === "userPosition") return el.userPosition === itemKey;
          return false;
        };
      } else {
        delete newSub[subMenuKey][itemKey];
      }
      return newSub;
    });
  };

  // Перерахунок фільтрованих чанків
  useEffect(() => {
    const chunks = computeFilteredChunks(currentFilters, props.activeMenu === "phones" ? phonesSubConditions : {});
    props.addIndexesOfFiltredResults(props.activeMenu, chunks);
  }, [currentFilters, phonesSubConditions, props.activeMenu]);

  const handleOnClearFormButtonClick = () => {
    if (props.activeMenu === "Lotus") setLotusFilters({});
    if (props.activeMenu === "Gov-ua") setGovUaFilters({});
    if (props.activeMenu === "phones") {
      setPhonesFilters({});
      setPhonesSubConditions({});
    }

    props.clearCurrentForm(props.activeMenu);

    // Редірект
    let page = 1;
    if (props.activeMenu === "Gov-ua") page = props.GovUaCurrentPage;
    if (props.activeMenu === "Lotus") page = props.lotusCurrentPage;
    if (props.activeMenu === "phones") page = props.phonesCurrentPage;

    navigateToPage(page);
  };

  const filterPointsForCurrentMenu = filterPoints.filter((p) =>
    p.pages.includes(props.activeMenu.toLowerCase())
  );

  const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = [];
    acc[item.groupName].push(item);
    return acc;
  }, {});

  const filteredChunks = computeFilteredChunks(currentFilters, props.activeMenu === "phones" ? phonesSubConditions : {});
  useEffect(() => {
  const chunks = computeFilteredChunks(currentFilters, props.activeMenu === "phones" ? phonesSubConditions : {});

  // Визначаємо чи є активні фільтри
  const anyFilterApplied = Object.values(currentFilters).some(v => v) ||
                           Object.values(phonesSubConditions).some(group => Object.keys(group).length > 0);

  // Передаємо в Redux
  props.addIndexesOfFiltredResults(props.activeMenu, chunks);
  props.addFilter(props.activeMenu, null, anyFilterApplied); // другий параметр null або обраний ключ фільтра
}, [currentFilters, phonesSubConditions, props.activeMenu]);


useEffect(() => {
  if (props.activeMenu === "phones") {
    const storedSubFilters = props.getSubFilters; // із Redux
    const initialSubConditions = {};

    Object.entries(storedSubFilters).forEach(([category, keysObj]) => {
      initialSubConditions[category] = {};
      Object.entries(keysObj).forEach(([key, isSelected]) => {
        if (isSelected) {
          initialSubConditions[category][key] = (el) => {
            if (category === "contactType") return el.userType === key;
            if (category === "userPosition") return el.userPosition === key;
            return false;
          };
        }
      });
    });

    setPhonesSubConditions(initialSubConditions);
  }
}, [props.activeMenu, props.getSubFilters]);


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
                const row = dataFromStore[pos.page - 1].rows[pos.index];
                return row.type === "section" || row.type === "department";
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
            handleChange={handlePhoneSubMenuChange}
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
  phonesCurrentPage: phonesCurrentPage(state)
});

const mapDispatchToProps = { addFilter, clearCurrentForm, addIndexesOfFiltredResults };

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
