// src/redux/hooks/useFilters.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { redirectToPage } from "../../Components/NavBar/commonFunctions";

const CHUNK_SIZE = 18;

export const useFilters = (props = {}) => {
  const {
    activeMenu,
    getGovUaMails,
    getLotusMails,
    getPhones,
    getSubFilters,
    addIndexesOfFiltredResults,
    addFilter,
    clearCurrentForm,
    GovUaCurrentPage,
    lotusCurrentPage,
    phonesCurrentPage,
    isPresentedFielterPanel
  } = props;

  const navigate = useNavigate();

  const [lotusFilters, setLotusFilters] = useState({});
  const [govUaFilters, setGovUaFilters] = useState({});
  const [phonesFilters, setPhonesFilters] = useState({});
  const [phonesSubConditions, setPhonesSubConditions] = useState({});


  const conditions = {
    personalMails: (el) => el.ownerType === "User",
    departmentMails: (el) => el.ownerType === "Department",
    sectionMails: (el) => el.ownerType === "Section",
    hasResponsible: (el) => el.responsibleUser !== "",
    passwordKnown: (el) => el.passwordKnown === true,
    hasPrevioustName: (el) => el.previousName !== null,
    hasNoResponsible: (el) => el.responsibleUser === "",
    hasNewPostName: (el) => el.name != null,
    passwordUnKnown: (el) => el.passwordKnown === false,
    NOThasNewPostName: (el) => el.name == null,
    NOThasPrevioustName: (el) => el.previousName === null,
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
    { pages: ["lotus"], groupName: "Негативна властивість", key: "NOThasPrevioustName", label: "(Не) має стару назву" },
    { pages: ["gov-ua", "lotus"], groupName: "Негативна властивість", key: "passwordUnKnown", label: "Пароль не відомий" },
    { pages: ["phones"], groupName: "Позитивна властивість", key: "hasLandlinePhone", label: "має Міський телефон" },
    { pages: ["phones"], groupName: "Позитивна властивість", key: "hasInternalPhone", label: "має Внутрішній телефон" },
    { pages: ["phones"], groupName: "Позитивна властивість", key: "hasCiscoPhone", label: "має IP Cisco телефон" },
    { pages: ["phones"], groupName: "Негативна властивість", key: "NOThasLandlinePhone", label: "(НЕ) має Міський телефон" },
    { pages: ["phones"], groupName: "Негативна властивість", key: "NOThasInternalPhone", label: "(НЕ) має Внутрішній телефон" },
    { pages: ["phones"], groupName: "Негативна властивість", key: "NOThasCiscoPhone", label: "(НЕ) має IP Cisco телефон" },
  ];

  const currentFilters =
    activeMenu === "Lotus" ? (lotusFilters || {}) :
    activeMenu === "Gov-ua" ? (govUaFilters || {}) :
    (phonesFilters || {});

  const getAlternativeKeys = (key) => {
    const direct = filterGroups[key] || [];
    const reverse = Object.keys(filterGroups).filter((k) => filterGroups[k].includes(key));
    return [...direct, ...reverse];
  };

  const hasAnyFilters = (filters = {}, subConditions = {}) => {
    const hasMain = Object.values(filters || {}).some(Boolean);
    const hasSub = Object.values(subConditions || {}).some(
      group => Object.keys(group || {}).length > 0
    );
    return hasMain || hasSub;
  };


  const navigateToPage = (page) => {
    let basePath;
    switch (activeMenu) {
      case "Gov-ua": basePath = "/mails/Gov-ua/"; break;
      case "Lotus": basePath = "/mails/Lotus/"; break;
      case "phones": basePath = "/phones/"; break;
      default: basePath = "/"; break;
    }
    navigate(basePath + page);
  };

 const redirectToCurrentPage = (filters = {}, subConditions = {}) => {
  const hasFilters = hasAnyFilters(filters, subConditions);


  const pageParams = {
    navigate,
    activeMenu,
    GovUaCurrentPage,
    lotusCurrentPage,
    phonesCurrentPage
  };

  
  if (hasFilters) {
    if (activeMenu === "Gov-ua") pageParams.GovUaCurrentPage = 1;
    else if (activeMenu === "Lotus") pageParams.lotusCurrentPage = 1;
    else if (activeMenu === "phones") pageParams.phonesCurrentPage = 1;
  }

  redirectToPage(pageParams);
};

 
 const handleCheckboxChange = (key) => {
    debugger;
  if (activeMenu === "Lotus") {
    setLotusFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters); // ⬅ редірект одразу після зміни
      return newFilters;
    });
  } else if (activeMenu === "Gov-ua") {
    setGovUaFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters); // ⬅ редірект одразу після зміни
      return newFilters;
    });
  } else {
    debugger;
    setPhonesFilters(prev => {
      const newFilters = { ...prev, [key]: !prev[key] };
      redirectToCurrentPage(newFilters, phonesSubConditions); // ⬅ редірект для phones із саб-фільтрами
      return newFilters;
    });
  }


  if (typeof addFilter === "function") addFilter(activeMenu, key);
};


  const handleOnClearFormButtonClick = () => {
    const page = 1;
    if (activeMenu === "Lotus") setLotusFilters({});
    if (activeMenu === "Gov-ua") setGovUaFilters({});
    if (activeMenu === "phones") {
      setPhonesFilters({});
      setPhonesSubConditions({});
      navigateToPage(page);
    }
    if (typeof clearCurrentForm === "function") clearCurrentForm(activeMenu);
    redirectToCurrentPage({}, {});
  };

  // Перевірка проходження рядка / користувача
  const passesFiltersForRow = (row, activeFilters = [], subConditions = {}) => {
    const checkRowOrUser = (el) => {
 const filtersPass = activeFilters.length === 0
  ? true
  : activeFilters.every(key => {

      // 1. знайти parent-групу (ключ, у якому сидить цей фільтр)
      const parentKey = Object.keys(filterGroups).find(
        grp => filterGroups[grp].includes(key)
      );

      // 2. Якщо немає групи — звичайна перевірка
      if (!parentKey) {
        return typeof conditions[key] === "function" && conditions[key](el);
      }

      // 3. Якщо є група → виділяємо всі альтернативи
      const alternatives = filterGroups[parentKey];

      // 4. Але OR робимо тільки між ТИМИ, що є у activeFilters
      const activeAlternatives = alternatives.filter(a =>
        activeFilters.includes(a)
      );

      // 5. Якщо активна лише одна альтернатива → звичайний OR через одну
      return activeAlternatives.some(a =>
        typeof conditions[a] === "function" && conditions[a](el)
      );
    });




      const subConditionsPass = Object.values(subConditions || {}).some(groupObj => Object.keys(groupObj || {}).length > 0)
        ? Object.values(subConditions || {}).some(groupObj =>
            Object.values(groupObj || {}).some(condFn => condFn(el))
          )
        : true;

      return filtersPass && subConditionsPass;
    };

    if (row?.type === "department") {
      const usersPass = row.users?.some(checkRowOrUser) || false;
      const sectionsPass = row.sections?.some(section =>
        section.users?.length > 0 && section.users.some(checkRowOrUser)
      ) || false;
      return usersPass || sectionsPass;
    }

    if (row?.type === "section") {
      return row.users?.length > 0 && row.users.some(checkRowOrUser);
    }

    return checkRowOrUser(row);
  };

  // Обчислення чанків
  const computeFilteredChunks = (state = {}, subConditions = {}) => {
    const activeFilters = Object.entries(state || {})
      .filter(([key, v]) => v && conditions[key])
      .map(([key]) => key);

    const dataFromStore =
      (activeMenu && activeMenu.toLowerCase() === "gov-ua")
        ? (getGovUaMails || [])
        : (activeMenu && activeMenu.toLowerCase() === "lotus")
          ? (getLotusMails || [])
          : (getPhones || []);

    const allFilteredIndexes = [];

    (dataFromStore || []).forEach((element, pageIndex) => {
      const rows = element?.rows || [];
      rows.forEach((row, rowIndex) => {
        if (passesFiltersForRow(row, activeFilters, subConditions)) {
          allFilteredIndexes.push({ page: pageIndex + 1, index: rowIndex, type: row.type });
        }
      });
    });

    const chunks = [];
    for (let i = 0; i < allFilteredIndexes.length; i += CHUNK_SIZE) {
      chunks.push({ pageIndex: chunks.length + 1, rows: allFilteredIndexes.slice(i, i + CHUNK_SIZE) });
    }
    debugger;
    return chunks;
  };

  // Перерахунок чанків у Redux коли змінюються фільтри або саб-умови
  useEffect(() => {
    const chunks = computeFilteredChunks(currentFilters, activeMenu === "phones" ? phonesSubConditions : {});
    if (typeof addIndexesOfFiltredResults === "function") {
      addIndexesOfFiltredResults(activeMenu, chunks);
    }
  }, [currentFilters, phonesSubConditions, activeMenu, addIndexesOfFiltredResults]);

  // groupedFilterPoints (робимо тут, але викликати можна і в компоненті)
  const filterPointsForCurrentMenu = (filterPoints || []).filter((p) =>
    p.pages.includes((activeMenu || "").toLowerCase())
  );

  const groupedFilterPoints = filterPointsForCurrentMenu.reduce((acc, item) => {
    if (!acc[item.groupName]) acc[item.groupName] = [];
    acc[item.groupName].push(item);
    return acc;
  }, {});

  // filteredChunks для рендеру
  const filteredChunks = computeFilteredChunks(currentFilters, activeMenu === "phones" ? phonesSubConditions : {});

  // Синхронізація саб-фільтрів з Redux getSubFilters
  useEffect(() => {
    if (activeMenu === "phones") {
      const storedSubFilters = getSubFilters || {};
      const initialSubConditions = {};
      Object.entries(storedSubFilters || {}).forEach(([category, keysObj]) => {
        initialSubConditions[category] = {};
        Object.entries(keysObj || {}).forEach(([key, isSelected]) => {
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
  }, [activeMenu, getSubFilters]);

  // Якщо змінились саб-фільтри у Redux — робимо редірект
  const prevSubFiltersRef = useRef({});
  useEffect(() => {
    if (activeMenu === "phones") {
      const hasSubFilters = Object.values(getSubFilters || {}).some(group => Object.keys(group || {}).length > 0);
      const hasMainFilters = Object.values(phonesFilters || {}).some(v => v);
      const prevSubFilters = prevSubFiltersRef.current;
      const subFiltersChanged = JSON.stringify(prevSubFilters) !== JSON.stringify(getSubFilters);
      if ((hasSubFilters || hasMainFilters) && subFiltersChanged) {
        redirectToCurrentPage(phonesFilters, getSubFilters || {});
      }
      prevSubFiltersRef.current = getSubFilters;
    }
  }, [getSubFilters, phonesFilters, activeMenu]);

  // Скидання коли панель ховається
  useEffect(() => {
    debugger;
    if (!isPresentedFielterPanel) {
        debugger;
      setLotusFilters({});
      setGovUaFilters({});
      setPhonesFilters({});
      setPhonesSubConditions({});
    }
  }, [isPresentedFielterPanel]);

  // Додатковий useEffect: повідомляємо про наявність фільтрів в Redux (як раніше)
  useEffect(() => {
    const chunks = computeFilteredChunks(currentFilters, activeMenu === "phones" ? phonesSubConditions : {});
    const anyFilterApplied = Object.values(currentFilters || {}).some(v => v) ||
      Object.values(phonesSubConditions || {}).some(group => Object.keys(group || {}).length > 0);

    if (typeof addIndexesOfFiltredResults === "function") addIndexesOfFiltredResults(activeMenu, chunks);
    if (typeof addFilter === "function") addFilter(activeMenu, null, anyFilterApplied);
  }, [currentFilters, phonesSubConditions, activeMenu, addIndexesOfFiltredResults, addFilter]);

  // Повертаємо API, яке використовувався в оригінальній компоненті

  return {
    filteredChunks,
    groupedFilterPoints,
    handleOnClearFormButtonClick,
    getAlternativeKeys,
    currentFilters,
    handleCheckboxChange,
    phonesSubConditions,
    filterPoints,
    filterGroups,
    filterPointsForCurrentMenu,
    
  };
};
