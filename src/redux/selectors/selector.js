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




export const getDataForMenu = (state, menu) => {

  const edit = isEditModeSelected(state);
  const activeDepartmentId = state.ui.activeDepartmentId;

  const isSection = isSectionsMode(state);
  const isDepartments = isDepartmentsMode(state);

  const isPositions = isPositionsMode(state);
  const isUserTypes = isUserTypesMode(state);
  const mode = state.ui.viewMode;

  // ========================================
  // POSITIONS / USER TYPES (FROM DICTIONARIES)
  debugger
  // ========================================
if (
  edit &&  
  menu === "phones" &&
  ["landline", "cisco", "internal"].includes(mode)
)
{
  let stateFor =state.data.dictionaries.phones[mode];
  debugger
   return state.data.dictionaries.phones[mode].map(page => ({
    ...page,
    rows: page.rows.map(dep => ({
      ...dep,
      type: "phone"
    }))
  }));
}
if (
  edit &&
  menu === "phones" &&
  (isDepartments || isSection) &&  !activeDepartmentId
) {
  return state.data.dictionaries.departments.map(page => ({
    ...page,
    rows: page.rows.map(dep => ({
      ...dep,
      type: "department"
    }))
  }));
}

  if (
    edit &&
    menu === "phones" &&
    (isPositions || isUserTypes)
  ) {

    const { positions, userTypes } = state.data.dictionaries;

    const rows = isPositions ? positions : userTypes;

    return rows; // OK
  }


  if (
    menu === "phones" &&
    isSection &&
    activeDepartmentId != null
  ) {
  
    return selectSectionsByDepartmentId(state, activeDepartmentId);
  }

  // ========================================
  // DEFAULT
  // ========================================
 
  return state?.data[menu] ?? [];
};
const selectSectionsByDepartmentId = (state, departmentId) => {
  const pages = state?.data?.dictionaries?.departments ?? [];
// debugger
  const matchedSections = pages.flatMap(page =>
    (page?.rows ?? [])
      .filter(row => row?.sections?.length) // тільки ті, де є sections
      .flatMap(row =>
        row.sections
          .filter(
            section =>
              section.departmentId == departmentId // або row.id якщо departmentId на row
          )
      )
  );
// debugger
  if (!matchedSections.length) return [];
const wither = matchedSections.map(row => ({
  ...row,
  type: "section"
}));
//  debugger
  // console.log("matches:", wither);
// debugger
let a =[ {
      pageIndex: 1,
      rows: wither
    }]
    // debugger
  return a
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
  [activeMenu, getPhonesCount, getLotusCount, getGovUaCount],
  (menu, phonesCount, lotusCount, govUaCount) => {
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
  const baseLink = getBaseLinkByMenu(menu);
  return state.currentPageNumber.previousLocation === `${baseLink}/foundResults`;
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

export const selectPaginationPagesCount = (menu) => (state) => getDataForMenu(state, menu).length || 0;
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
  const data = getDataForMenu(state, menu);

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


// selector.js
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
  //console.log ("isSectionsMode:",state.ui.viewMode == "sections" )
  return state.ui.viewMode == "section"};

export const isDepartmentsMode = (state) => {
  //console.log ("isSectionsMode:",state.ui.viewMode == "sections" )
  return state.ui.viewMode == "department"};

export const isPositionsMode = (state) => {
  //console.log ("isSectionsMode:",state.ui.viewMode == "sections" )
  return state.ui.viewMode == "position"};

export const isUserTypesMode = (state) => {
  //console.log ("isSectionsMode:",state.ui.viewMode == "sections" )
  return state.ui.viewMode == "userType"};


export const getCurrentMode = (state) =>  state.ui.viewMode;



export const selectAtiveDepartmentId = (state)=> state.ui.activeDepartmentId;

export const selectPositionsDictionary = (state) => state.data.dictionaries.positions;

export const selectDictionaryByType = (type) => (state) =>
  state.data.dictionaries[type];

export const selectSectionsById = (activeDepartmentId) => (state) =>  selectSectionsByDepartmentId(state, activeDepartmentId);




