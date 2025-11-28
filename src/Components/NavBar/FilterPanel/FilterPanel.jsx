import { connect } from "react-redux";
import {
  getGovUaMails,
  activeMenu,
  getFilteredState,
  getLotusMails,
  getPhones,
  GovUaCurrentPage,
  lotusCurrentPage,
  phonesCurrentPage
} from "../../../redux/selectors/selector";
import s from "../FilterPanel/FilterPanel.module.css";
import CustomCheckbox from "./CustomCheckbox/CustomCheckBox.jsx";
import { useState } from "react";
import { addFilter, clearCurrentForm, addIndexesOfFiltredResults } from "../../../redux/selectors/filterData-reducer.js";
import { useNavigate } from "react-router-dom";

const CHUNK_SIZE = 18;

const FilterPanel = (props) => {
  const govUa = "gov-ua";
  const lotus = "lotus";
  const phones = "phones";
  const navigate = useNavigate();

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

  const filterPointsForCurrentMenu = filterPoints.filter((p) =>
    p.pages.includes(props.activeMenu.toLowerCase())
  );

  const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = [];
    acc[item.groupName].push(item);
    return acc;
  }, {});

  const [checkboxState, setCheckboxState] = useState(() => {
    const used = props.getFilteredState(props.activeMenu);
    const initialState = {};
    filterPointsForCurrentMenu.forEach((item) => {
      initialState[item.key] = used[item.key] || false;
    });
    return initialState;
  });

  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) => filterGroups[k].includes(key));
    return [...direct, ...reverse];
  };

  const passesFiltersForRow = (row, activeFilters) => {
    if (!activeFilters.length) return true;

    if (row.type === "department") {
      const usersPass = row.users?.some(u => activeFilters.every(f => conditions[f](u))) || false;

      const sectionsPass = row.sections?.some(section =>
        section.users?.length > 0 && section.users.every(u => activeFilters.every(f => conditions[f](u)))
      ) || false;

      return usersPass || sectionsPass;
    }

    if (row.type === "section") {
      return row.users?.length > 0 && row.users.every(u => activeFilters.every(f => conditions[f](u)));
    }

    return activeFilters.every(f => conditions[f](row));
  };

  const computeFilteredChunks = (state) => {
    const filters = Object.entries(state).filter(([_, v]) => v).map(([key]) => key);

    const dataFromStore =
      props.activeMenu.toLowerCase() === "gov-ua"
        ? props.getGovUaMails || []
        : props.activeMenu.toLowerCase() === "lotus"
          ? props.getLotusMails || []
          : props.getPhones || [];

    const allFilteredIndexes = [];

    dataFromStore.forEach((element, pageIndex) => {
      element.rows.forEach((row, rowIndex) => {
        if (passesFiltersForRow(row, filters)) {
          allFilteredIndexes.push({ page: pageIndex + 1, index: rowIndex , type: row.type});
        }
      });
    });

    const chunks = [];
    for (let i = 0; i < allFilteredIndexes.length; i += CHUNK_SIZE) {
      chunks.push({ pageIndex: chunks.length + 1, rows: allFilteredIndexes.slice(i, i + CHUNK_SIZE) });
    }
    return chunks;
  };

  // -------------------- Функція редиректу на поточну сторінку --------------------
  const redirectToCurrentPage = () => {
    let redirectPage;
    let basePath;

    switch (props.activeMenu) {
      case "Gov-ua":
        basePath = "/mails/Gov-ua/";
        redirectPage = props.GovUaCurrentPage;
        break;
      case "Lotus":
        basePath = "/mails/Lotus/";
        redirectPage = props.lotusCurrentPage;
        break;
      case "phones":
        basePath = "/phones/";
        redirectPage = props.phonesCurrentPage;
        break;
      default:
        basePath = "/";
        redirectPage = 1;
    }

    navigate(`${basePath}${redirectPage}`);
  };

  const handleCheckboxChange = (key) => {
    const altKeys = getAlternativeKeys(key);
    setCheckboxState(prev => {
      const updated = { ...prev, [key]: !prev[key] };

      // Вимикаємо альтернативні чекбокси
      if (updated[key]) altKeys.forEach(alt => (updated[alt] = false));

      // Редирект на першу сторінку при активації чекбокса
      if (updated[key]) {
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
        navigate(`${basePath}1`);
      }

      // Обчислюємо фільтри і зберігаємо індекси
      const chunks = computeFilteredChunks(updated);
      props.addIndexesOfFiltredResults(props.activeMenu, chunks);
      props.addFilter(props.activeMenu, key);

      // Редирект якщо всі чекбокси зняті
      const anyChecked = Object.values(updated).some(v => v);
      if (!anyChecked) redirectToCurrentPage();

      return updated;
    });
  };

  const handleOnClearFormButtonClick = () => {
    props.clearCurrentForm(props.activeMenu);
    setCheckboxState({});
    props.addIndexesOfFiltredResults(props.activeMenu, []);
    redirectToCurrentPage();
  };

  const filteredChunks = computeFilteredChunks(checkboxState);

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
  GovUaCurrentPage: GovUaCurrentPage(state),
  lotusCurrentPage: lotusCurrentPage(state),
  phonesCurrentPage: phonesCurrentPage(state)
});

const mapDispatchToProps = { addFilter, clearCurrentForm, addIndexesOfFiltredResults };

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
