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
  const govUa = "gov-ua";
  const lotus = "lotus";
  const phones = "phones";
  const navigate = useNavigate();

  const [selectedSubConditions, setSelectedSubConditions] = useState([]);
  const [subConditions, setSubocnditions] = useState({});
  const [checkboxState, setCheckboxState] = useState(() => {
    const used = props.getFilteredState(props.activeMenu) || {};
    const initialState = {};
    Object.keys(used).forEach(key => {
      initialState[key] = used[key] || false;
    });
    return initialState;
  });

  const filterPoints = [
    { pages: [govUa, lotus], groupName: "Власник", key: "personalMails", label: "Персональні" },
    { pages: [govUa, lotus], groupName: "Власник", key: "departmentMails", label: "Самостійного підрозділу" },
    { pages: [govUa, lotus], groupName: "Власник", key: "sectionMails", label: "(Не) самостійного підрозділу" },
    { pages: [govUa], groupName: "Позитивна властивість", key: "hasResponsible", label: "Має відповідальну особу" },
    { pages: [lotus], groupName: "Позитивна властивість", key: "hasNewPostName", label: "Має нову назву" },
    { pages: [lotus], groupName: "Позитивна властивість", key: "hasPrevioustName", label: "Має стару назву" },
    { pages: [govUa, lotus], groupName: "Позитивна властивість", key: "passwordKnown", label: "Пароль відомий" },
    { pages: [govUa], groupName: "Негативна властивість", key: "hasNoResponsible", label: "(Не) має відповідальну особу" },
    { pages: [lotus], groupName: "Негативна властивість", key: "NOThasNewPostName", label: "(Не) має нову назву" },
    { pages: [lotus], groupName: "Позитивна властивість", key: "NOThasPrevioustName", label: "(Не) має стару назву" },
    { pages: [govUa, lotus], groupName: "Негативна властивість", key: "passwordUnKnown", label: "Пароль не відомий" },
    { pages: [phones], groupName: "Позитивна властивість", key: "hasLandlinePhone", label: "має Міський телефон" },
    { pages: [phones], groupName: "Позитивна властивість", key: "hasInternalPhone", label: "має Внутрішній телефон" },
    { pages: [phones], groupName: "Позитивна властивість", key: "hasCiscoPhone", label: "має IP Cisco телефон" },
    { pages: [phones], groupName: "Негативна властивість", key: "NOThasLandlinePhone", label: "(НЕ) має Міський телефон" },
    { pages: [phones], groupName: "Негативна властивість", key: "NOThasInternalPhone", label: "(НЕ) має Внутрішній телефон" },
    { pages: [phones], groupName: "Негативна властивість", key: "NOThasCiscoPhone", label: "(НЕ) має IP Cisco телефон" },
  ];

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
     const subConditionsPass =
  Object.values(subConditions).some(groupObj => Object.keys(groupObj).length > 0)
    ? Object.values(subConditions).some(groupObj =>
        Object.values(groupObj).some(condFn => condFn(el))
      )
    : true;
    debugger;

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
  debugger
    return chunks;
  };

const navigateToPage = (page) => {
  let basePath;

  switch (props.activeMenu) {
    case "Gov-ua":
      basePath = "/mails/Gov-ua/";
      break;
    case "Lotus":
      basePath = "/mails/Lotus/";
      break;
    case "phones":
      basePath = "/phones/";
      break;
    default:
      basePath = "/";
  }

  navigate(basePath + page);
};

  // Встановлюємо сабумови для phones при зміні меню
  useEffect(() => {
    if (props.activeMenu === "phones") {
      const storedSubFilters = props.getFilteredState("phones").subFilters || {};
     
   
  const initialSubConditions = {};

Object.entries(storedSubFilters).forEach(([variety, keysObj]) => {
  initialSubConditions[variety] = {};
  Object.entries(keysObj).forEach(([key, isSelected]) => {
    if (isSelected) {
      initialSubConditions[variety][key] = (el) => {
        if (variety === "contactType") return el.userType === key;
        if (variety === "userPosition") return el.userPosition === key;
        return false;
      };
    }
  });
});



      setSubocnditions(initialSubConditions);
      //setSelectedSubConditions(Object.keys(storedSubFilters).filter(k => storedSubFilters[k]));
      debugger;
    }
  }, [props.activeMenu, props.getSubFilters]);

  // Перерахунок фільтрованих чанків
  useEffect(() => {
    debugger;
    const chunks = computeFilteredChunks(checkboxState, subConditions);
    props.addIndexesOfFiltredResults(props.activeMenu, chunks);
    debugger;

  }, [checkboxState, subConditions]);

  const handleCheckboxChange = (key) => {
    const altKeys = getAlternativeKeys(key);
    setCheckboxState(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (updated[key]) altKeys.forEach(alt => (updated[alt] = false));
      props.addFilter(props.activeMenu, key);
      debugger;
      return updated;
    });
  };
useEffect(() => {
  const anyChecked = Object.values(checkboxState).some(v => v) || Object.values(subConditions).some(v => v);

  let page;
  if (anyChecked) {
    // якщо є обрана умова — редірект на 1
    page = 1;
  } else {
    // якщо нічого не обрано — редірект на сторінку зі стора
    if (props.activeMenu === "Gov-ua") page = props.GovUaCurrentPage;
    else if (props.activeMenu === "Lotus") page = props.lotusCurrentPage;
    else if (props.activeMenu === "phones") page = props.phonesCurrentPage;
    else page = 1;
  }

  navigateToPage(page);
}, [checkboxState, subConditions]);


  const handleOnClearFormButtonClick = () => {
  props.clearCurrentForm(props.activeMenu);
  setCheckboxState({});
  setSubocnditions({});
  setSelectedSubConditions([]);


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

  const filteredChunks = computeFilteredChunks(checkboxState, subConditions);

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
              const isDisabled = altKeys.some(alt => checkboxState[alt]);
              return (
                <CustomCheckbox
                  key={item.key}
                  label={item.label}
                  checked={checkboxState[item.key] || false}
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
           // initialSelected={selectedSubConditions}
           // setSelected={setSelectedSubConditions}
           // setSubocnditions={setSubocnditions}
           // handleCheckboxChange={handleCheckboxChange}
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
  getSubFilters:getSubFilters(state),
  GovUaCurrentPage: GovUaCurrentPage(state),
  lotusCurrentPage: lotusCurrentPage(state),
  phonesCurrentPage: phonesCurrentPage(state)
});

const mapDispatchToProps = { addFilter, clearCurrentForm, addIndexesOfFiltredResults };

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
