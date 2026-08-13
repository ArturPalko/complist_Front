// selectors.js
import { createSelector, current } from "@reduxjs/toolkit";
import { Pages } from "../../configs/app/constants";
import { createCurrentPageSelector } from "./selectorFabrics/createCurrentPageSelector";
import { countContacts } from "../../Components/NavBar/FilterPanel/countContacts";
import { makeGetCountByMenu } from "./selectorFabrics/makeGetCountForMenu";
import { extractPositionsAndTypes } from "./helpFunctions/extractPositionsAndTypes";
import { countDepartmentsAndSections } from "./helpFunctions/countDepartmentsAndSections";
import { getBaseLinkByMenu } from "./helpFunctions/getBaseLinkByMenu";
import { processFoundResults } from "./helpFunctions/processFoundResults";
import {findDashedBlocks} from "./helpFunctions/findDashedBlocks";
import { getFilteredPageData } from "../../shared/functions/getDataByIndexes";
import { makeGetDepSecByMenu } from "./selectorFabrics/makeDepSecByMenu";
import { useSelector } from "react-redux";
import { buildDepartmentPages } from "./selectorFabrics/buildDepartmentsPages";

// =====Допоміжні селектори=======================

const selectPageNumberState = (state, menu) => state.currentPageNumber[menu];
export const selectFoundResults = (state, menu) => selectSearchValueByPage(menu)(state)?.foundResults ?? [];

export const getCurrentMode = (state) =>  state.ui.viewMode;


export const getDataForMenu = (state, menu) => {
  const currentMode = getCurrentMode(state);

  if (currentMode) {
    return getDictionaryData(state);
  }

  return state.data?.[menu] ?? [];
};
const selectSectionsByDepartmentId = (state, departmentId) => {
  const pages = state?.data?.dictionaries?.departments ?? [];

  const matchedSections = pages.flatMap(page =>
    (page?.rows ?? [])
      .filter(row => row?.sections?.length)
      .flatMap(row =>
        row.sections
          .filter(section => section.departmentId == departmentId)
          .map(section => ({
            ...section,
            type: "section",
          }))
      )
  );

  if (!matchedSections.length) return [];

  return [
    {
      pageIndex: 1,
      rows: matchedSections,
    },
  ];
};


export const getLoadedForMenu = (state, menu) => Boolean(state.dataState?.[menu]?.dataIsLoaded);
export const getFetchingForMenu = (state, menu) => Boolean(state.dataState?.[menu]?.dataIsFetching);


// ===================================
// ===== Пошук =====
export const selectSearchValueByPage = (page) => (state) => state.toggledElements.searchField[page] ?? {};
export const foundSearchValueOnAnyPage = (pagesArray) => (state) => {
  for (const page of pagesArray) {
    const value = state.toggledElements.searchField[page];
    if (value) return value;
  }
  return null;
};
export const isSearchValueFoundByPage = (page) => (state) =>
  Boolean(selectFoundResults(state, page)?.length);


export const selectSearchStateByMenu = (state, menu) =>
  state.toggledElements.searchField[menu] || {
    draftValue: "",
    searchValue: "",
    foundResults: []
  };

// ===================================
// ===== Меню =====
export const activeMenu = (state) => state.currentPageNumber.activeMenu;

export const currentPageByMenu = (state, menu) => {
  if (!menu) return 1;

  const isFilterApplied = isFilterAppliedSelector(menu)(state); 
  const pageState = selectPageNumberState(state, menu);
  const foundResults = selectFoundResults(state, menu);


  return createCurrentPageSelector({ isFilterApplied, pageState, foundResults }) ?? 1;
};

export const searchFieldValue = (state, menu) => state.toggledElements.searchField[menu]?.searchValue || "";

// ===================================
export const getDictionaryPages = (state) =>
    state.currentPageNumber.dictionary;

// ===== Поточні сторінки =====
export const getCurrentPageNumberByKey = (key) => (state) =>
  state.currentPageNumber[key]?.lastVisitedPage ?? 1;

export const getLastVisitedPage = (state, menu) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage ?? 1;

// ===================================
// ===== Кешовані селектори кількостей =====
export const getPhonesCount = makeGetCountByMenu(Pages.PHONES);
export const getLotusCount = makeGetCountByMenu(Pages.LOTUS);
export const getGovUaCount = makeGetCountByMenu(Pages.GOV_UA);

export const getCountsForActiveMenu = createSelector(
  [activeMenu, getCurrentMode, getPhonesCount, getLotusCount, getGovUaCount],
  (menu, currentMode, phonesCount, lotusCount, govUaCount) => {
    if (currentMode) {
      return phonesCount;
    }

    const map = {
      [Pages.PHONES]: phonesCount,
      [Pages.LOTUS]: lotusCount,
      [Pages.GOV_UA]: govUaCount,
    };

    return map[menu] ?? 0;
  }
);

// ===================================
// ===== Контакти =====
export const menuSelectors = {
  [Pages.PHONES]: (state) => getPhonesCount(state).countOfUsers || 0,
  [Pages.LOTUS]: (state) => getLotusCount(state).countOfMails || 0,
  [Pages.GOV_UA]: (state) => getGovUaCount(state).countOfMails || 0,
};



export const getContactsCount = ({
  selectorResult,
  isFilterApplied,
  filteredChunks = [],
  dataByMenu = []
}) => {
  if (!isFilterApplied) {
    return selectorResult ?? "0";
  }

  return countContacts({ filteredChunks, dataByMenu });
};


// ===================================
// ===== Інші селектори =====
export const getPositionsAndTypesOfUsers = createSelector(
  [(state) => getDataForMenu(state, Pages.PHONES)],
  (phonesData) => extractPositionsAndTypes(phonesData)
);

export const getDepartmentsAndSectionsPerPage = createSelector(
  [(state) => getDataForMenu(state, Pages.PHONES)],
  (phonesData) => countDepartmentsAndSections(phonesData)
);



export const getFilteredState = (state, activeMenu) => state.filters?.[activeMenu]?.usedFilters || {};
export const getIndexesOfFiltredResults = (state, activeMenu) => state.filters?.[activeMenu]?.filtredResults || [];
export const getCountOfPageForFiltredResults = (state, activeMenu) =>
  state.filters?.[activeMenu]?.filtredResults?.length || 0;

export const isFilterAppliedSelector = (menu) => (state) => state.filters?.[menu]?.isFilterApplied ?? false;
export const getCurentFilterPage = (state, activeMenu) =>
  state.currentPageNumber?.[activeMenu]?.filterPage ?? 1;

export const getSubFilters = (state) => state.filters[Pages.PHONES]?.usedFilters.subFilters ?? [];
export const isPresentedSearchField = (state) => state.toggledElements.showSearchField.isActive;
export const isPresentedFielterPanel = (state) => state.toggledElements.showFilterPanel.isActive;
export const isPagesNavbarLinkElementOnCurrentPagePressed = (state) =>
  state.toggledElements.pagesNavbarLinkElementOnCurrentPage.isPressed;
export const isEditModeSelected = (state) => state.appMode.editMode;

export const isPreviousPageWasFoundResult = (menu) => (state) => {
  if (!menu) return false;

  const currentMode = getCurrentMode(state);
  const previousLocation = state.currentPageNumber.previousLocation;

  if (currentMode) {
    return (
      previousLocation?.startsWith("/dictionary/") &&
      previousLocation?.endsWith("/foundResults")
    );
  }

  const baseLink = getBaseLinkByMenu(menu);

  return previousLocation === `${baseLink}/foundResults`;
};


// ===================================
// ===== Підрахунок знайдених результатів =====
export const getCountOfFoundResults = (state, typeOfPage) =>
  typeOfPage === Pages.PHONES
    ? selectFoundResults(state, typeOfPage)
        .filter(r => r.elementType === "user").length
    : selectFoundResults(state, typeOfPage).length;

export const getPageIndexDataOfFoundResultsByPage = (pageName) => (state) => {
  return processFoundResults(selectFoundResults(state, pageName));
};


export const selectPaginationPagesCount =
  (menu, mode) => (state) => {

    const dictionaryModes = ["positions", "userTypes", "departments", "sections"];
    const phonesSubmodes = ["landline", "internal", "cisco"]
    if(mode == "sections"){
      return selectDictionaryByType("departments")(state).length || 0;
    }
    if (phonesSubmodes.includes(mode)){
      return selectDictionaryByType(mode, "phones")(state).length || 0;
    }
    if (dictionaryModes.includes(mode)) {
      return selectDictionaryByType(mode)(state).length || 0;
    }

    return getDataForMenu(state, menu).length || 0;
};
export const isCurrentPageFoundResult = (menu) => (state) =>
  selectPageNumberState(state,menu)?.lastVisitedPage === "foundResults";

export const selectFiltersForMenu = (menu) => (state) => {
  if (!menu || !state.filters[menu]) return {};
  return state.filters[menu].usedFilters;
};

export const selectPhonesSubcondions = (state) => {
  return state.filters.phones?.usedFilters?.subFilters || {};
};

///////////
export const selectIndexesFromCell = (state) => {
  return state.toggledElements.indexesFromIndexCell || []
}
//////************** */
// export const selectDashedBlocks = createSelector(
//   [(state) => getDataForMenu(state, "phones")],
//   (pages) => findDashedBlocks(pages)
// );

export const selectDashedBlocks = (state) => {
  const menu = "phones";
  // const data = getDataForMenu(state, menu);
  const data = state.data.phones

  const sourceData = isFilterAppliedSelector(menu)(state)
    ? getFilteredPageData(state, data, menu).data
    : data;
             

  return findDashedBlocks(sourceData);
};

export const formMessage = (state) => {
  return state.auth.message;
}

export const authUserName = (state) => {
  return state.auth.userName;
}

export const isUserAuthed = (state) => {
  return state.auth.isLoggedIn;
}


// 

export const selectBookmarks = (state, menu) => {
  return state.filters?.[menu]?.bookmarks ?? { selectedSubDepts: [], selectedOrder: [] };
};


// 2. Створюємо кешовані селектори для конкретних меню
export const getPhonesDepSec = makeGetDepSecByMenu(Pages.PHONES);
export const getGovUaDepSec = makeGetDepSecByMenu(Pages.GOV_UA);
export const getLotusDepSec = makeGetDepSecByMenu(Pages.LOTUS);
// 3. Метод, який повертає результат потрібного селектора
export const getDepartmentsAndSections = (state, menuKey) => {
  switch (menuKey) {
    case Pages.PHONES:
      return getPhonesDepSec(state);
    case Pages.GOV_UA:
      return getGovUaDepSec(state);
    case Pages.LOTUS:
      return getLotusDepSec(state);
    default:
      return { dep: [], sec: [] };
  }
};
export const getPhonesDepartmenstForOrder = createSelector(
  [(state) => state?.data?.phones],
  (phones) => buildDepartmentPages(phones)
);


export const isSectionsMode = (state) => {
  return state.ui.viewMode == "sections"};

export const isDepartmentsMode = (state) => {
  return state.ui.viewMode == "departments"};

export const isPositionsMode = (state) => {
  return state.ui.viewMode == "positions"};

export const isUserTypesMode = (state) => {  
  return state.ui.viewMode == "userTypes"};


// export const getCurrentMode = (state) =>  state.ui.viewMode;



export const selectAtiveDepartmentId = (state)=> state.ui.activeDepartment.id;
export const selectActiveSectionId =  (state)=> state.ui.activeSection.id;



export const selectAtiveDepartmentName = (state)=> state.ui.activeDepartment.name;
export const selectActiveSectionName =  (state)=> state.ui.activeSection.name;


export const selectPositionsDictionary = (state) => state.data.dictionaries.positions;

export const selectDictionaryByType =
(type, upperLevel) => (state) => {

  const activeDepartmentId = state.ui.activeDepartment.id;
  const activeSectionId = state.ui.activeSection.id;

  if (type === "departments") {

    // Користувачі департаменту
    if (activeDepartmentId != null) {
      return getDictionaryData(state);
    }

    return state.data.dictionaries.departments || [];
  }

  if (type === "sections") {

    // Користувачі секції
    if (activeSectionId != null) {
      return getDictionaryData(state);
    }

    // Секції департаменту
    if (activeDepartmentId != null) {
      return getDictionaryData(state);
    }

    return state.data.dictionaries.departments || [];
  }

  if (upperLevel) {
    return state.data.dictionaries?.[upperLevel]?.[type] || [];
  }

  return state.data.dictionaries?.[type] || [];
};

export const selectSectionsById = (activeDepartmentId) => (state) =>  selectSectionsByDepartmentId(state, activeDepartmentId);

export const addUsersModeSelected = (state) => state.ui.addUsersMode; 


export const selectUsersByDepartment = (departmentId) => (state) => {
  ;

  const departments = state.data.dictionaries.departments;

  const rows = departments.flatMap(element => element.rows);

  const department = rows.find(dep => dep.departmentId == departmentId);

  const users = department?.users ?? [];

  ;

  return users;
};

export const selectUsersBySection =
  (activeDepartmentId, activeSectionId) =>
  (state) => {
    const departments = state.data.dictionaries.departments ?? [];

    const department = departments
      .flatMap(d => d.rows)
      .find(dep => dep.departmentId == activeDepartmentId);

    if (!department) return [];

    const section = department.sections?.find(
      sec => sec.sectionId == activeSectionId
    );

    if (!section) return [];

    return section.users ?? [];
  };


  //////////////// новий селекто для дікшенс

  export const getDictionaryData = (state) => {
  const edit = isEditModeSelected(state);

  const activeDepartmentId = state.ui.activeDepartment.id;
  const activeSectionId = state.ui.activeSection.id;

  const isAddUsers = addUsersModeSelected(state);

  const isSection = isSectionsMode(state);
  const isDepartments = isDepartmentsMode(state);
  const isPositions = isPositionsMode(state);
  const isUserTypes = isUserTypesMode(state);

  const mode = state.ui.viewMode;

  // ==========================
  // USERS
  // ==========================
  if (edit && isAddUsers && activeDepartmentId && !isSection) {
    return [
      {
        pageIndex: 1,
        rows: selectUsersByDepartment(
          activeDepartmentId,
          activeSectionId
        )(state),
      },
    ];
  }

  if (
  edit &&
  isAddUsers &&
  isSection &&
  activeDepartmentId != null &&
  activeSectionId != null
) {
  return [
    {
      pageIndex: 1,
      rows: selectUsersBySection(
        activeDepartmentId,
        activeSectionId
      )(state),
    },
  ];
}

  // ==========================
  // PHONE EDIT MODE
  // ==========================
  if (edit && ["landline", "internal", "cisco"].includes(mode)) {
    return state.data.dictionaries.phones[mode].map((page) => ({
      ...page,
      rows: page.rows.map((row) => ({
        ...row,
        type: "phone",
      })),
    }));
  }

  // ==========================
  // DEPARTMENTS
  // ==========================
  if (edit && (isDepartments || isSection) && !activeDepartmentId) {
    return state.data.dictionaries.departments.map((page) => ({
      ...page,
      rows: page.rows.map((row) => ({
        ...row,
        type: "department",
      })),
    }));
  }

  // ==========================
  // SECTIONS
  // ==========================
  if (edit && isSection && activeDepartmentId != null) {
    return selectSectionsByDepartmentId(state, activeDepartmentId);
  }

  // ==========================
  // POSITIONS
  // ==========================
  if (isPositions) {
    return state.data.dictionaries.positions.map((page) => ({
      ...page,
      type: "position",
      rows: page.rows.map((row) => ({
        ...row,
        type: "position",
      })),
    }));
  }

  // ==========================
  // USER TYPES
  // ==========================
  if (isUserTypes) {
    return state.data.dictionaries.userTypes.map((page) => ({
      ...page,
      type: "userType",
      rows: page.rows.map((row) => ({
        ...row,
        type: "userType",
      })),
    }));
  }

  return [];
};

  export const getSearchMode = (state) => state.ui.searchMode;

  export const selectFoundResultsByPage = (page) => (state) =>
  state.toggledElements.searchField?.[page]?.foundResults ?? [];