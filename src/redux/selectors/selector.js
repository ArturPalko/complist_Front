// selectors.js
import { createSelector } from "@reduxjs/toolkit";
import { Pages } from "./constants";
import { createCurrentPageSelector } from "./selectorFabrics/createCurrentPageSelector";
import { countContacts } from "../../Components/NavBar/FilterPanel/countContacts";
import { makeGetCountByMenu } from "./selectorFabrics/makeGetCountForMenu";
import { extractPositionsAndTypes } from "./helpFunctions/extractPositionsAndTypes";
import { countDepartmentsAndSections } from "./helpFunctions/countDepartmentsAndSections";
import { getBaseLinkByMenu } from "./helpFunctions/getBaseLinkByMenu";
import { processFoundResults } from "./helpFunctions/processFoundResults";

// ===================================
// ===== Дані =====
export const getDataForMenu = (state, menu) => state.data?.[menu] ?? [];
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
  Boolean(state.toggledElements.searchField[page]?.foundResults?.length);

// ===================================
// ===== Меню =====
export const activeMenu = (state) => state.currentPageNumber.activeMenu;

export const currentPageByMenu = (state, menu) => {
  if (!menu) return 1;
  const hasFilter = menu === Pages.PHONES;
  const selector = createCurrentPageSelector({
    key: menu,
    foundSelector: selectSearchValueByPage(menu),
    hasFilter,
  });
  return selector(state) ?? 1;
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
const menuSelectors = {
  [Pages.PHONES]: (state) => getPhonesCount(state).countOfUsers || 0,
  [Pages.LOTUS]: (state) => getLotusCount(state).countOfMails || 0,
  [Pages.GOV_UA]: (state) => getGovUaCount(state).countOfMails || 0,
};

export const getContactsCount = ({ state, activeMenu, isFilterApplied, filteredChunks, dataByMenu }) => {
  if (!isFilterApplied) {
    const selector = menuSelectors[activeMenu];
    return selector ? selector(state) : 0;
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
  [getDataForMenu],
  (data) => countDepartmentsAndSections(data[Pages.PHONES] || [])
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

export const isPreviousPageWasFoundResult = (menu) => (state) => {
  if (!menu) return false;
  const baseLink = getBaseLinkByMenu(menu);
  return state.currentPageNumber.previousLocation === `${baseLink}/foundResults`;
};

// ===================================
// ===== Підрахунок знайдених результатів =====
export const getCountOfFoundResults = (state, typeOfPage) => {
  const results = state.toggledElements?.searchField?.[typeOfPage]?.foundResults ?? [];
  if (typeOfPage === Pages.PHONES) return results.filter((r) => r.elementType === "user").length;
  return results.length;
};

export const getPageIndexDataOfFoundResultsByPage = (pageName) => (state) => {
  const foundResults = state.toggledElements.searchField[pageName]?.foundResults ?? [];
  return processFoundResults(foundResults);
};

export const selectPaginationPagesCount = (menu) => (state) => getDataForMenu(state, menu).length || 0;
export const isCurrentPageFoundResult = (menu) => (state) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage === "foundResults";
