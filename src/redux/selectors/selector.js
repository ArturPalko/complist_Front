import userEvent from "@testing-library/user-event";
import { selectUniqueCount,countMailData } from "./helpFunctions/countMailsData";
import { createSelector } from "@reduxjs/toolkit";
import { countPhoneData } from "./helpFunctions/countPhonesData";
import {createCurrentPageSelector} from "./selectorFabrics/createCurrentPageSelector"
import { extractPositionsAndTypes } from "./helpFunctions/extractPositionsAndTypes";
import { countDepartmentsAndSections } from "./helpFunctions/countDepartmentsAndSections";
import { getBaseLinkByMenu } from './helpFunctions/getBaseLinkByMenu'; 
import { getPaginationPages } from "./helpFunctions/getPaginationPages";
import { processFoundResults } from "./helpFunctions/processFoundResults";




// ===== дані =====
export const getDataForMenu = (state, menu) => {
  if (!menu) return [];

  if (menu === "phones") {
    return state.phones?.pages ?? [];
  }

  return state.mails?.[menu] ?? [];
};

// ===== статуси =====
export const getLoadedForMenu = (state, menu) =>
  Boolean(state.dataState?.[menu]?.dataIsLoaded);

export const getFetchingForMenu = (state, menu) =>
  Boolean(state.dataState?.[menu]?.dataIsFetching);


export const rowsPerPage = 18;
export const pages = ["Gov-ua", "Lotus", "phones"];

export const selectSearchValueByPage = (page) => (state) =>
  state.toggledElements.searchField[page];

export const foundSearchValueOnAnyPage = (pagesArray) => (state) => {
  for (const page of pagesArray) {
    const value = state.toggledElements.searchField[page];
    if (value) return value;
  }
  return null;
};



export const getLotusMails = (state) => {
    return state.mails.Lotus 
}

export const getGovUaMails = (state) => {
    return state.mails["Gov-ua"] 
}

export const getPhones = (state) => {
    return state.phones.pages
}

export const selectPaginationPagesCount =
  (activeMenu) =>
  (state) => {

    return getPaginationPages(state, activeMenu)?.length || 0;
  };

  
// ===== конкретні селектори =====
export const phonesCurrentPage = createCurrentPageSelector({
  key: "phones",
  foundSelector: selectSearchValueByPage("phones"),
  hasFilter: true,
});

export const lotusCurrentPage = createCurrentPageSelector({
  key: "Lotus",
  foundSelector: selectSearchValueByPage("Lotus"),
});

export const GovUaCurrentPage = createCurrentPageSelector({
  key: "Gov-ua",
  foundSelector: selectSearchValueByPage("Gov-ua"),
});

// export const isLotusDataLoaded = (state) =>{
//         return state.dataState.Lotus.dataIsLoaded
// }

// export const isGovUaDataLoaded = (state) =>{
//         return state.dataState["Gov-ua"].dataIsLoaded
// }

// export const isPhonesDataLoaded = (state) =>{
//         return state.dataState.phones.dataIsLoaded
// }

// export const isLotusDataFetching = (state) => {
//   return state.dataState.Lotus.dataIsFetching;
// };
// export const isGovUaDataFetching = (state) => {
//   return state.dataState["Gov-ua"].dataIsFetching;
// };
// export const isPhonesDataFetching = (state) => {
//   return state.dataState.phones.dataIsFetching;
// };

export const isPresentedSearchField = (state) =>{
  return state.toggledElements.showSearchField.isActive ;
  
}
export const isPresentedFielterPanel = (state) =>{
  return state.toggledElements.showFilterPanel.isActive ;
  
}

export const activeMenu = (state) => state.currentPageNumber.activeMenu;
export const searchFieldValue = (state, menu) => {
  return state.toggledElements.searchField[menu]?.searchValue || "";
};

export const isSearchValueFoundByPage = (page) => (state) =>
  Boolean(state.toggledElements.searchField[page]?.foundResults?.length);





export const getCurrentPageNumberByKey = (key) => (state) => state.currentPageNumber[key].lastVisitedPage;





export const getPageIndexDataOfFoundResultsByPage = (pageName) => (state) => {
  const foundSearchValueOfPage = state.toggledElements.searchField[pageName];
  return processFoundResults(foundSearchValueOfPage?.foundResults);
};



export const getPhonesCurrentPageNumber = (state) =>
  state.currentPageNumber.phones ;

export const getLotusMailsCurretPageNumber = (state) =>
  state.currentPageNumber.Lotus;

export const getGovMailsCurretPageNumber = (state) =>
  state.currentPageNumber["Gov-ua"];



export const isPagesNavbarLinkElementOnCurrentPagePressed = (state) =>
  state.toggledElements.pagesNavbarLinkElementOnCurrentPage.isPressed;

// export const isPreviousPageWasFoundResult = (state) => {
//   const page = activeMenu(state);
//   const baseLink = getBaseLinkByMenu(page);
//   return state.currentPageNumber.previousLocation === `${baseLink}/foundResults`;
// };

export const isPreviousPageWasFoundResult = (menu) => (state) => {
  if (!menu) return false;

  const baseLink = getBaseLinkByMenu(menu);
  return state.currentPageNumber.previousLocation === `${baseLink}/foundResults`;
};



export const getCountOfFoundResults = (state, typeOfPage) => {
  const results = state.toggledElements?.searchField?.[typeOfPage]?.foundResults ?? [];
  if (typeOfPage === "phones") {
    return results.filter(r => r.elementType === "user").length;
  }

  return results.length;
};

  

// //////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// кешовані селектори для кожного меню
export const getPhonesCount = createSelector([getPhones], countPhoneData);
export const getLotusCount = createSelector([getLotusMails], countMailData);
export const getGovUaCount = createSelector([getGovUaMails], countMailData);

// основний селектор з кешуванням для активного меню
export const getCountsForActiveMenu = createSelector(
  [activeMenu, getPhonesCount, getLotusCount, getGovUaCount],
  (menu, phonesCount, lotusCount, govUaCount) => {
    switch (menu) {
      case 'phones': return phonesCount;
      case 'Lotus': return lotusCount;
      case 'Gov-ua': return govUaCount;
      default: return {};
    }
  }
);



export const getDepartmentsAndSectionsPerPage = createSelector(
  [getPhones],
  (phones) => countDepartmentsAndSections(phones)
);


export const getFilteredState = (state, activeMenu) => {
  return state.filters?.[activeMenu]?.usedFilters || {};
};

export const getIndexesOfFiltredResults = (state, activeMenu) => {
  return state.filters?.[activeMenu]?.filtredResults || [];
};


export const getCountOfPageForFiltredResults = (state, activeMenu) => {
  let a =  state.filters?.[activeMenu]?.filtredResults.length || [];
  return a
};

export const isFilterAppliedSelector = (menu) => (state) =>
  state.filters?.[menu]?.isFilterApplied ?? false;

export const getCurentFilterPage = (state, activeMenu) =>
  state.currentPageNumber?.[activeMenu]?.filterPage ?? 1;

export const getPositionsAndTypesOfUsers = createSelector(
  [getPhones],
  (phones) => extractPositionsAndTypes(phones)
);


export const getSubFilters = (state) =>
  state.filters.phones?.usedFilters.subFilters ?? [];

// selector.js
export const isCurrentPageFoundResult = (menu) => (state) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage === "foundResults";


export const getLastVisitedPage = (state,menu) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage || 1;




