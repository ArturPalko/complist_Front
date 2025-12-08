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



const hasAnyFilters = (filters = {}, subConditions = {}) => {
  const hasMain = Object.values(filters).some(Boolean);

  const hasSub = Object.values(subConditions).some(
    group => Object.keys(group).length > 0
  );

  return hasMain || hasSub;
};

const redirectToCurrentPage = (filters = {}, subConditions = {}) => {
  const hasFilters = hasAnyFilters(filters, subConditions);

  let page;

  if (hasFilters) {
    // Є активні фільтри — завжди 1 сторінка
    page = 1;
  } else {
    // Немає фільтрів — повертаємось на поточну сторінку зі стора
    switch (props.activeMenu) {
      case "Gov-ua":
        page = props.GovUaCurrentPage || 1;
        break;
      case "Lotus":
        page = props.lotusCurrentPage || 1;
        break;
      case "phones":
        page = props.phonesCurrentPage || 1; // ✅ беремо стору для Phones
        break;
      default:
        page = 1;
    }
  }

  navigateToPage(page);
};
  // Зміна чекбоксу для поточного меню
const handleCheckboxChange = (key) => {
  if (props.activeMenu === "Lotus") {
    setLotusFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters); // редірект після оновлення
      return newFilters;
    });
  } else if (props.activeMenu === "Gov-ua") {
    setGovUaFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters); // редірект після оновлення
      return newFilters;
    });
  } else {
    // Phones
    setPhonesFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters, phonesSubConditions); // редірект для Phones
      return newFilters;
    });
  }

  // Redux update
  props.addFilter(props.activeMenu, key);
};


  const handleOnClearFormButtonClick = () => {
    let page = 1;
    if (props.activeMenu === "Lotus") setLotusFilters({});
    if (props.activeMenu === "Gov-ua") setGovUaFilters({});
    if (props.activeMenu === "phones") {
      setPhonesFilters({});
      setPhonesSubConditions({});

      navigateToPage(page); 
    }

    props.clearCurrentForm(props.activeMenu);
    redirectToCurrentPage({}, {});


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





  // Перерахунок фільтрованих чанків
  useEffect(() => {
    const chunks = computeFilteredChunks(currentFilters, props.activeMenu === "phones" ? phonesSubConditions : {});
    props.addIndexesOfFiltredResults(props.activeMenu, chunks);
  }, [currentFilters, phonesSubConditions, props.activeMenu]);



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
// Фільтровані саб-умови для Phones беремо з Redux
const prevSubFiltersRef = useRef({});

useEffect(() => {
  if (props.activeMenu === "phones") {
    const hasSubFilters = Object.values(props.getSubFilters || {})
      .some(group => Object.keys(group).length > 0);

    const hasMainFilters = Object.values(phonesFilters || {}).some(v => v);

    const prevSubFilters = prevSubFiltersRef.current;

    // Перевіряємо, чи змінилися саб-фільтри
    const subFiltersChanged = JSON.stringify(prevSubFilters) !== JSON.stringify(props.getSubFilters);

    if ((hasSubFilters || hasMainFilters) && subFiltersChanged) {
      redirectToCurrentPage(phonesFilters, props.getSubFilters);
    }

    // Оновлюємо реф після перевірки
    prevSubFiltersRef.current = props.getSubFilters;
  }
}, [props.getSubFilters, phonesFilters, props.activeMenu]);


const isPresentedFielterPanel = useSelector(state => 
  state.toggledElements.showFilterPanel.isActive
);

useEffect(() => {
  if (!isPresentedFielterPanel) {
    setLotusFilters({});
    setGovUaFilters({});
    setPhonesFilters({});
    setPhonesSubConditions({});
  }
}, [isPresentedFielterPanel]);


 
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
