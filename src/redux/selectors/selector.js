// selectors.js

import { createSelector } from "@reduxjs/toolkit";

import { Pages, rowsPerPage } from "../../configs/app/constants";

import { createCurrentPageSelector } from "./selectorFabrics/createCurrentPageSelector";
import { makeGetCountByMenu } from "./selectorFabrics/makeGetCountForMenu";
import { makeGetDepSecByMenu } from "./selectorFabrics/makeDepSecByMenu";
import { buildDepartmentPages } from "./selectorFabrics/buildDepartmentsPages";

import { countContacts } from "../../Components/NavBar/FilterPanel/countContacts";
import { getFilteredPageData } from "../../shared/functions/getDataByIndexes";

import { extractPositionsAndTypes } from "./helpFunctions/extractPositionsAndTypes";
import { countDepartmentsAndSections } from "./helpFunctions/countDepartmentsAndSections";
import { getBaseLinkByMenu } from "./helpFunctions/getBaseLinkByMenu";
import { processFoundResults } from "./helpFunctions/processFoundResults";
import { findDashedBlocks } from "./helpFunctions/findDashedBlocks";
import { getDictionaryCount } from "./helpFunctions/getDictionaryCount";
import { countDictionaryRows } from "./helpFunctions/countDictionaryRows";
import { chunkIntoPages } from "../providers/DragProvider/dragProvider-helpers/commonFunctions";

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const EMPTY_SEARCH_STATE = {
  draftValue: "",
  searchValue: "",
  foundResults: EMPTY_ARRAY,
};

const EMPTY_BOOKMARKS = {
  selectedSubDepts: EMPTY_ARRAY,
  selectedOrder: EMPTY_ARRAY,
};

const EMPTY_PHONES_BY_USER = {
  landline: null,
  internal: null,
  cisco: null,
};


const EMPTY_DEP_SEC = {
  dep: EMPTY_ARRAY,
  sec: EMPTY_ARRAY,
};
export const hasSearchFoundResults =
  (menu, currentMode) => (state) => {
    const searchPage = currentMode
      ? "dictionary"
      : menu;

    return Boolean(
      state.toggledElements.searchField?.[searchPage]
        ?.foundResults?.length
    );
  };
const selectPageNumberState = (state, menu) =>
  state.currentPageNumber[menu];

export const selectFoundResults = (state, menu) =>
  selectSearchValueByPage(menu)(state)?.foundResults ??
  EMPTY_ARRAY;

export const getCurrentMode = (state) =>
  state.ui.viewMode;

export const getDataForMenu = (state, menu) => {
  const currentMode = getCurrentMode(state);

  if (currentMode) {
    return getDictionaryData(state);
  }

  return state.data?.[menu] ?? EMPTY_ARRAY;
};

const selectSectionsByDepartmentId = createSelector(
  [
    (state) =>
      state?.data?.dictionaries?.departments ??
      EMPTY_ARRAY,

    (_, departmentId) => departmentId,
  ],
  (pages, departmentId) => {
    const matchedSections = pages.flatMap(
      (page) =>
        (page?.rows ?? EMPTY_ARRAY)
          .filter((row) => row?.sections?.length)
          .flatMap((row) =>
            row.sections
              .filter(
                (section) =>
                  section.departmentId === departmentId
              )
              .map((section) => ({
                ...section,
                type: "section",
              }))
          )
    );

    const result = chunkIntoPages(
      matchedSections,
      rowsPerPage
    );

      ;

    return result;
  }
);

export const getDictionaryData = createSelector(
  [
    (state) => state,
  ],
  (state) => {
    const edit = isEditModeSelected(state);

    const activeDepartmentId =
      state.ui.activeDepartment.id;

    const activeSectionId =
      state.ui.activeSection.id;

    const isAddUsers = addUsersModeSelected(state);

    const isSection = isSectionsMode(state);
    const isDepartments = isDepartmentsMode(state);
    const isPositions = isPositionsMode(state);
    const isUserTypes = isUserTypesMode(state);
    const isUsers = isUserMode(state);

    const mode = state.ui.viewMode;

if (
  edit &&
  isAddUsers &&
  activeDepartmentId &&
  !isSection
) {
  return selectUsersByDepartment(
    activeDepartmentId
  )(state);
}

if (
  edit &&
  isAddUsers &&
  isSection &&
  activeDepartmentId != null &&
  activeSectionId != null
) {
  return selectUsersBySection(
    activeDepartmentId,
    activeSectionId
  )(state);
}

    if (
      edit &&
      ["landline", "internal", "cisco"].includes(mode)
    ) {
      return state.data.dictionaries.phones[mode].map(
        (page) => ({
          ...page,
          rows: page.rows.map((row) => ({
            ...row,
            type: "phone",
          })),
        })
      );
    }

    if (
      edit &&
      (isDepartments || isSection) &&
      !activeDepartmentId
    ) {
      return state.data.dictionaries.departments.map(
        (page) => ({
          ...page,
          rows: page.rows.map((row) => ({
            ...row,
            type: "department",
          })),
        })
      );
    }

    if (
      edit &&
      isSection &&
      activeDepartmentId != null
    ) {
      return selectSectionsByDepartmentId(
        state,
        activeDepartmentId
      );
    }

    if (isPositions) {
      return state.data.dictionaries.positions.map(
        (page) => ({
          ...page,
          type: "position",
          rows: page.rows.map((row) => ({
            ...row,
            type: "position",
          })),
        })
      );
    }

    if (isUserTypes) {
      return state.data.dictionaries.userTypes.map(
        (page) => ({
          ...page,
          type: "userType",
          rows: page.rows.map((row) => ({
            ...row,
            type: "userType",
          })),
        })
      );
    }

    if (isUsers) {
      return state.data.dictionaries.users.map(
        (page) => ({
          ...page,
          type: "user",
          rows: page.rows.map((row) => ({
            ...row,
            type: "user",
          })),
        })
      );
    }

    return EMPTY_ARRAY;
  }
);
export const getLoadedForMenu = (state, menu) =>
  Boolean(state.dataState?.[menu]?.dataIsLoaded);

export const getFetchingForMenu = (state, menu) =>
  Boolean(state.dataState?.[menu]?.dataIsFetching);

export const selectSearchValueByPage =
  (page) => (state) =>
    state.toggledElements.searchField[page] ??
    EMPTY_OBJECT;

export const foundSearchValueOnAnyPage =
  (pagesArray) => (state) => {
    for (const page of pagesArray) {
      const value =
        state.toggledElements.searchField[page];

      if (value) {
        return value;
      }
    }

    return null;
  };

export const isSearchValueFoundByPage =
  (page) => (state) =>
    Boolean(
      selectFoundResults(state, page)?.length
    );

export const selectSearchStateByMenu = (state, menu) =>
  state.toggledElements.searchField[menu] ||
  EMPTY_SEARCH_STATE;

export const getSearchMode = (state) =>
  state.ui.searchMode;

export const selectFoundResultsByPage =
  (page) => (state) =>
    state.toggledElements.searchField?.[page]
      ?.foundResults ?? EMPTY_ARRAY;

export const activeMenu = (state) =>
  state.currentPageNumber.activeMenu;

export const currentPageByMenu = (state, menu) => {
  if (!menu) {
    return 1;
  }

  const isFilterApplied =
    isFilterAppliedSelector(menu)(state);

  const pageState =
    selectPageNumberState(state, menu);

  const foundResults =
    selectFoundResults(state, menu);

  return (
    createCurrentPageSelector({
      isFilterApplied,
      pageState,
      foundResults,
    }) ?? 1
  );
};

export const searchFieldValue = (state, menu) =>
  state.toggledElements.searchField[menu]
    ?.searchValue || "";

export const getDictionaryPages = (state) =>
  state.currentPageNumber.dictionary;

export const getCurrentPageNumberByKey =
  (key) => (state) =>
    state.currentPageNumber[key]?.lastVisitedPage ?? 1;

export const getLastVisitedPage = (state, menu) =>
  state.currentPageNumber?.[menu]?.lastVisitedPage ?? 1;

export const getPhonesCount =
  makeGetCountByMenu(Pages.PHONES);

export const getLotusCount =
  makeGetCountByMenu(Pages.LOTUS);

export const getGovUaCount =
  makeGetCountByMenu(Pages.GOV_UA);

export const getCountsForActiveMenu = createSelector(
  [
    activeMenu,
    getCurrentMode,
    getPhonesCount,
    getLotusCount,
    getGovUaCount,
    getDictionaryData,
    (state) => state.ui.activeDepartment.id,
    (state) => state.ui.activeSection.id,
  ],
  (
    menu,
    currentMode,
    phonesCount,
    lotusCount,
    govUaCount,
    dictionaryData,
    activeDepartmentId,
    activeSectionId
  ) => {
    if (currentMode) {
      const count =
        countDictionaryRows(dictionaryData);

      return getDictionaryCount(
        currentMode,
        count,
        activeDepartmentId,
        activeSectionId
      );
    }

    const map = {
      [Pages.PHONES]: phonesCount,
      [Pages.LOTUS]: lotusCount,
      [Pages.GOV_UA]: govUaCount,
    };

    return map[menu] ?? 0;
  }
);

export const menuSelectors = {
  [Pages.PHONES]: (state) =>
    getPhonesCount(state).countOfUsers || 0,

  [Pages.LOTUS]: (state) =>
    getLotusCount(state).countOfMails || 0,

  [Pages.GOV_UA]: (state) =>
    getGovUaCount(state).countOfMails || 0,
};

export const getContactsCount = ({
  selectorResult,
  isFilterApplied,
  filteredChunks = EMPTY_ARRAY,
  dataByMenu = EMPTY_ARRAY,
}) => {
  if (!isFilterApplied) {
    return selectorResult ?? "0";
  }

  return countContacts({
    filteredChunks,
    dataByMenu,
  });
};

export const getPositionsAndTypesOfUsers =
  createSelector(
    [
      (state) =>
        getDataForMenu(state, Pages.PHONES),
    ],
    (phonesData) =>
      extractPositionsAndTypes(phonesData)
  );

export const getDepartmentsAndSectionsPerPage =
  createSelector(
    [
      (state) =>
        getDataForMenu(state, Pages.PHONES),
    ],
    (phonesData) =>
      countDepartmentsAndSections(phonesData)
  );

export const getFilteredState = (
  state,
  activeMenu
) =>
  state.filters?.[activeMenu]?.usedFilters ||
  EMPTY_OBJECT;

export const getIndexesOfFiltredResults = (
  state,
  activeMenu
) =>
  state.filters?.[activeMenu]?.filtredResults ||
  EMPTY_ARRAY;

export const getCountOfPageForFiltredResults = (
  state,
  activeMenu
) =>
  state.filters?.[activeMenu]?.filtredResults
    ?.length || 0;

export const isFilterAppliedSelector =
  (menu) => (state) =>
    state.filters?.[menu]?.isFilterApplied ?? false;

export const getCurentFilterPage = (
  state,
  activeMenu
) =>
  state.currentPageNumber?.[activeMenu]
    ?.filterPage ?? 1;

export const getSubFilters = (state) =>
  state.filters[Pages.PHONES]
    ?.usedFilters.subFilters ?? EMPTY_ARRAY;

export const selectFiltersForMenu =
  (menu) => (state) => {
    if (!menu || !state.filters[menu]) {
      return EMPTY_OBJECT;
    }

    return state.filters[menu].usedFilters;
  };

export const selectPhonesSubcondions = (state) => {
  return (
    state.filters.phones?.usedFilters
      ?.subFilters || EMPTY_OBJECT
  );
};

export const isPresentedSearchField = (state) =>
  state.toggledElements.showSearchField.isActive;

export const isPresentedFielterPanel = (state) =>
  state.toggledElements.showFilterPanel.isActive;

export const isPagesNavbarLinkElementOnCurrentPagePressed =
  (state) =>
    state.toggledElements
      .pagesNavbarLinkElementOnCurrentPage
      .isPressed;

export const isEditModeSelected = (state) =>
  state.appMode.editMode;

export const isPreviousPageWasFoundResult =
  (menu) => (state) => {
    if (!menu) {
      return false;
    }

    const currentMode = getCurrentMode(state);
    const previousLocation =
      state.currentPageNumber.previousLocation;

    if (currentMode) {
      return (
        previousLocation?.startsWith(
          "/dictionary/"
        ) &&
        previousLocation?.endsWith(
          "/foundResults"
        )
      );
    }

    const baseLink =
      getBaseLinkByMenu(menu);

    return (
      previousLocation ===
      `${baseLink}/foundResults`
    );
  };

export const getCountOfFoundResults = (
  state,
  typeOfPage
) =>
  typeOfPage === Pages.PHONES
    ? selectFoundResults(state, typeOfPage)
        .filter(
          (r) => r.elementType === "user"
        )
        .length
    : selectFoundResults(
        state,
        typeOfPage
      ).length;

export const getPageIndexDataOfFoundResultsByPage =
  (pageName) => (state) => {
    return processFoundResults(
      selectFoundResults(state, pageName)
    );
  };

export const selectPaginationPagesCount =
  (menu, mode) => (state) => {
    const dictionaryModes = [
      "positions",
      "userTypes",
      "departments",
      "sections",
    ];

    const phonesSubmodes = [
      "landline",
      "internal",
      "cisco",
    ];

    if (
      dictionaryModes.includes(mode) ||
      phonesSubmodes.includes(mode)
    ) {
      const a =
        getDictionaryData(state).length || 0;

      return a;
    }

    return (
      getDataForMenu(state, menu).length || 0
    );
  };

export const isCurrentPageFoundResult =
  (menu, currentMode) => (state) => {
    if (currentMode) {
      return (
        state.currentPageNumber.dictionary[currentMode]?.lastVisitedPage ===
        "foundResults"
      );
    }

    return (
      selectPageNumberState(
        state,
        menu
      )?.lastVisitedPage === "foundResults"
    );
  };

export const selectIndexesFromCell = (state) =>
  state.toggledElements.indexesFromIndexCell ||
  EMPTY_ARRAY;

const selectPhonesData = (state) =>
  state.data.phones;

const selectPhonesFilterApplied = (state) =>
  state.filters?.phones?.isFilterApplied ?? false;

export const selectDashedBlocks = createSelector(
  [
    (state) => state,
    selectPhonesData,
    selectPhonesFilterApplied,
  ],
  (state, data, isFilterApplied) => {
    const sourceData = isFilterApplied
      ? getFilteredPageData(
          state,
          data,
          "phones"
        ).data
      : data;

    return findDashedBlocks(sourceData);
  }
);

export const formMessage = (state) => {
  return state.auth.message;
};

export const authUserName = (state) => {
  return state.auth.userName;
};

export const isUserAuthed = (state) => {
  return state.auth.isLoggedIn;
};

export const selectBookmarks = (
  state,
  menu
) => {
  return (
    state.filters?.[menu]?.bookmarks ??
    EMPTY_BOOKMARKS
  );
};

export const getPhonesDepSec =
  makeGetDepSecByMenu(Pages.PHONES);

export const getGovUaDepSec =
  makeGetDepSecByMenu(Pages.GOV_UA);

export const getLotusDepSec =
  makeGetDepSecByMenu(Pages.LOTUS);

export const getDepartmentsAndSections = (
  state,
  menuKey
) => {
  switch (menuKey) {
    case Pages.PHONES:
      return getPhonesDepSec(state);

    case Pages.GOV_UA:
      return getGovUaDepSec(state);

    case Pages.LOTUS:
      return getLotusDepSec(state);

    default:
      return EMPTY_DEP_SEC;
  }
};

export const getPhonesDepartmenstForOrder =
  createSelector(
    [(state) => state?.data?.phones],
    (phones) =>
      buildDepartmentPages(phones)
  );

export const isSectionsMode = (state) => {
  return state.ui.viewMode === "sections";
};

export const isDepartmentsMode = (state) => {
  return state.ui.viewMode === "departments";
};

export const isPositionsMode = (state) => {
  return state.ui.viewMode === "positions";
};

export const isUserTypesMode = (state) => {
  return state.ui.viewMode === "userTypes";
};

export const isUserMode = (state) => {
  return state.ui.viewMode === "users";
};

export const selectAtiveDepartmentId = (state) =>
  state.ui.activeDepartment.id;

export const selectActiveSectionId = (state) =>
  state.ui.activeSection.id;

export const selectAtiveDepartmentName = (state) =>
  state.ui.activeDepartment.name;

export const selectActiveSectionName = (state) =>
  state.ui.activeSection.name;

export const selectPositionsDictionary = (state) =>
  state.data.dictionaries.positions;

export const selectDictionaryByType =
  (type, upperLevel) => (state) => {
    if (upperLevel) {
      return (
        state.data.dictionaries?.[upperLevel]?.[
          type
        ] ?? EMPTY_ARRAY
      );
    }

    return (
      state.data.dictionaries?.[type] ??
      EMPTY_ARRAY
    );
  };

export const selectDictionaryDataForDrag =
  (type, upperLevel) => (state) => {
    const activeDepartmentId =
      state.ui.activeDepartment.id;

    const activeSectionId =
      state.ui.activeSection.id;

    if (type === "departments") {
      if (activeDepartmentId != null) {
        return getDictionaryData(state);
      }

      return getDictionaryData(state);
    }

    if (type === "sections") {
      if (activeSectionId != null) {
        return getDictionaryData(state);
      }

      if (activeDepartmentId != null) {
        return getDictionaryData(state);
      }

      return getDictionaryData(state);
    }

    if (upperLevel) {
      return (
        state.data.dictionaries?.[
          upperLevel
        ]?.[type] || EMPTY_ARRAY
      );
    }

    return (
      state.data.dictionaries?.[type] ||
      EMPTY_ARRAY
    );
  };

export const selectSectionsById =
  (activeDepartmentId) => (state) =>
    selectSectionsByDepartmentId(
      state,
      activeDepartmentId
    );

export const addUsersModeSelected = (state) =>
  state.ui.addUsersMode;

export const selectUsersByDepartment =
  (departmentId) => (state) => {
    const departments =
      state.data.dictionaries.departments ??
      EMPTY_ARRAY;

    const rows = departments.flatMap(
      (element) =>
        element.rows ?? EMPTY_ARRAY
    );

    const department = rows.find(
      (dep) =>
        dep.departmentId === departmentId
    );

    const users = department?.users ?? EMPTY_ARRAY;

    return chunkIntoPages(users, rowsPerPage);
  };

export const selectUsersBySection =
  (
    activeDepartmentId,
    activeSectionId
  ) => (state) => {
    const departments =
      state.data.dictionaries.departments ??
      EMPTY_ARRAY;

    const department = departments
      .flatMap(
        (d) => d.rows ?? EMPTY_ARRAY
      )
      .find(
        (dep) =>
          dep.departmentId ===
          activeDepartmentId
      );

    if (!department) {
      return EMPTY_ARRAY;
    }

    const section =
      department.sections?.find(
        (sec) =>
          sec.sectionId ===
          activeSectionId
      );

    if (!section) {
      return EMPTY_ARRAY;
    }

    const users =
      section.users ?? EMPTY_ARRAY;
    let a = chunkIntoPages(users, 18);
      
    return a
  };

export const selectPhonesByUserId = (userId) =>
  createSelector(
    [
      (state) =>
        state.data.dictionaries.phones,
    ],
    (phones) => {
      if (!userId) {
        return EMPTY_PHONES_BY_USER;
      }

      const result = {
        landline: null,
        internal: null,
        cisco: null,
      };

      Object.keys(result).forEach(
        (phoneType) => {
          const pages =
            phones?.[phoneType] ??
            EMPTY_ARRAY;

          const phoneRows = pages.flatMap(
            (page) =>
              page.rows ?? EMPTY_ARRAY
          );

          const phone = phoneRows.find(
            (phone) =>
              phone.users?.some(
                (user) =>
                  String(user.id) ===
                  String(userId)
              )
          );

          if (phone) {
            result[phoneType] = phone.id;
          }
        }
      );

      return result;
    }
  );

const selectDepartments = (state) =>
  state.data.dictionaries.departments ??
  EMPTY_ARRAY;

export const selectAllUsers = createSelector(
  [selectDepartments],
  (departments) => {
    const users = departments
      .flatMap(
        (page) =>
          page.rows ?? EMPTY_ARRAY
      )
      .flatMap((department) => [
        ...(department.users ??
          EMPTY_ARRAY),

        ...(department.sections ??
          EMPTY_ARRAY).flatMap(
          (section) =>
            section.users ??
            EMPTY_ARRAY
        ),
      ]);

    return Array.from(
      new Map(
        users.map((user) => [
          user.id,
          user,
        ])
      ).values()
    );
  }
);