// CORE STATE HELPERS
// =====================================================
import { updateMenuState } from "./filterData-reducerFunctions/updateMenuState";

// =====================================================
// DOMAIN LOGIC (BOOKMARKS / FILTER HELPERS)
// =====================================================
import { toggleAllDepartmentsLogic } from "./filterData-reducerFunctions/bookmarks/toglers/toggleAllDepartmentLogic";
import { toggleSubDeptLogic } from "./filterData-reducerFunctions/bookmarks/setters/toggleSuDeptLogic";
import { setBookmarkLogic } from "./filterData-reducerFunctions/bookmarks/setters/setBookMarkLogic";
import { toggleBookmarkFlag } from "./filterData-reducerFunctions/bookmarks/toglers/toogleBookmarkFlag";
import { toggleAutoHide } from "./filterData-reducerFunctions/bookmarks/toglers/toggleAutoHide";
import { updateMenuWithBookmarks } from "./filterData-reducerFunctions/bookmarks/updateMenuWithBookmarks";
import { updateFilters } from "./filterData-reducerFunctions/filters/updateFilters";

// =====================================================
//  ACTION TYPES
// =====================================================
const SET_MAIN_FILTERS = "SET_MAIN_FILTERS";
const SET_SUB_FILTERS = "SET_SUB_FILTERS";
const CLEAR_FILTRED_STATE_FOR_CURRENT_FORM = "CLEAR_FILTRED_STATE_FOR_CURRENT_FORM";
const ADD_INDEXES_OF_FILTRED_RESULTS = "ADD_INDEXES_OF_FILTRED_RESULTS";
const CLEAR_FILTRED_DATA = "CLEAR_FILTRED_DATA";
const BOOKMARKS_DEPARTMENTS_CHANGED = "BOOKMARKS_DEPARTMENTS_CHANGED"
const BOOKMARKS_SECTIONS_CHANGED = "BOOKMARKS_SECTIONS_CHANGED"
const TOGGLE_ALL_DEPARTMENTS = "TOGGLE_ALL_DEPARTMENTS"
const TOGGLE_HIDE_USERS_WITHOUT_SECTIONS = "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS"
const TOGGLE_HIDE_SECTIONS = "TOGGLE_HIDE_SECTIONS"
const TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS = "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS"
const TOGGLE_AUTO_SELECT_HIDE_SECTIONS = "TOGGLE_AUTO_SELECT_HIDE_SECTIONS"


// =====================================================
// INITIAL STATE FACTORY
// =====================================================
const createMenuState = (menu) => {
  const baseFilters = {
    filtredResults: [],
    isFilterApplied: false
  };

  const usedFiltersMap = {
    "Gov-ua": {
      personalMails: false,
      departmentMails: false,
      sectionMails: false,
      hasResponsible: false,
      passworKnown: false,
      hasNoResponsible: false,
      passwordUnknown: false
    },
    Lotus: {
      personalMails: false,
      departmentMails: false,
      hasPrevioustName: false,
      hasNewPostName: false,
      passworKnown: false,
      passwordUnknown: false
    },
    phones: {
      hasLadnlinePhone: false,
      hasInternalPhone: false,
      hasCiscoPhone: false,
      NOThasLadnlinePhone: false,
      NOThasInternalPhone: false,
      NOThasCiscoPhone: false,
      subFilters: { contactType: {}, userPosition: {} }
    }
  };

  const bookmarks = {
    selectedSubDepts: {},
    selectedOrder: [],
    allHideUsersWithoutSections: false,
    allHideSections: false,
    hideUsersWithoutSections: {},
    hideSections: {}
  };

  return {
    usedFilters: usedFiltersMap[menu],
    bookmarks,
    ...baseFilters
  };
};

// =====================================================
// INITIAL STATE
// =====================================================
export const initialState = {
  "Gov-ua": createMenuState("Gov-ua"),
  Lotus: createMenuState("Lotus"),
  phones: createMenuState("phones")
};

// =====================================================
//  REDUCER
// =====================================================
export const filterDataReducer = (state = initialState, action) => {

  const {
    menu,
    deptName,
    sub,
    filter,
    variety,
    values,
    checked,
    departments,
    sections
  } = action;

  
  switch (action.type) {

    // =====================================================
    // BOOKMARKS: bulk operations
    // =====================================================
    case "TOGGLE_ALL_DEPARTMENTS": {
        return updateMenuState(state, menu, menuState => {
          const bookmarks = toggleAllDepartmentsLogic(menuState, departments);
          return updateMenuWithBookmarks(menuState, bookmarks);
      });
    }

    case "BOOKMARKS_SECTIONS_CHANGED": {
      return updateMenuState(state, menu, menuState => {
        const bookmarks = toggleSubDeptLogic(menuState, deptName, sub);
        return updateMenuWithBookmarks(menuState, bookmarks);
      });
    }

      case "BOOKMARKS_DEPARTMENTS_CHANGED": {
        return updateMenuState(state, menu, menuState => {
          const bookmarks = setBookmarkLogic(menuState, deptName, sections);
          return updateMenuWithBookmarks(menuState, bookmarks);
        });
      }

    // =====================================================
    // BOOKMARKS: toggle flags
    // =====================================================


    case "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS": {
      return updateMenuState(state, menu, menuState =>
        toggleBookmarkFlag(menuState, "hideUsersWithoutSections", deptName)
      );
    }

    case "TOGGLE_HIDE_SECTIONS": {
      return updateMenuState(state, menu, menuState =>
        toggleBookmarkFlag(menuState, "hideSections", deptName)
      );
    }

    // =====================================================
    // BOOKMARKS: auto-select logic
    // =====================================================

    case "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS": {
  return updateMenuState(state, menu, menuState =>
    toggleAutoHide(
      menuState,
      "allHideUsersWithoutSections",
      "hideUsersWithoutSections"
    )
  );
}

   case "TOGGLE_AUTO_SELECT_HIDE_SECTIONS": {
  return updateMenuState(state, menu, menuState =>
    toggleAutoHide(
      menuState,
      "allHideSections",
      "hideSections"
    )
  );
}

    // =====================================================
    // FILTERS
    // =====================================================
case "SET_MAIN_FILTERS": {
  return updateMenuState(state, menu, menuState =>
    updateFilters(menuState, {
      type: "mainFilters",
      filter
    })
  );
}
case "SET_SUB_FILTERS": {
  if (menu !== "phones") return state;

  return updateMenuState(state, menu, menuState => 
    updateFilters(menuState, { 
      type: "subFilters",
      subFiltersUpdate: {
        variety,
        values,
        checked
      }
    })
  );
}

    // =====================================================
    //  CLEAR + RESULTS
    // =====================================================

case CLEAR_FILTRED_STATE_FOR_CURRENT_FORM: {
  return updateMenuState(state, menu, () =>
    createMenuState(menu)
  );
}

    case CLEAR_FILTRED_DATA:
      return { ...initialState };

  case ADD_INDEXES_OF_FILTRED_RESULTS: {
    return updateMenuState(state, menu, menuState => ({
      ...menuState,
      filtredResults: action.filtredIndexesOfFoundResults
    }));
  }

    default:
      return state;
  }
};
// ================== ACTION CREATORS ==================
export const addFilter = (menu, filter) => ({ type: SET_MAIN_FILTERS, menu, filter });
export const setSubFilters = (menu, variety, values, checked) => ({
  type: SET_SUB_FILTERS, menu, variety, values, checked
});
export const clearCurrentForm = (menu) => ({ type: CLEAR_FILTRED_STATE_FOR_CURRENT_FORM, menu });
export const addIndexesOfFiltredResults = (menu, filtredIndexesOfFoundResults) => ({
  type: ADD_INDEXES_OF_FILTRED_RESULTS, menu, filtredIndexesOfFoundResults
});
export const clearFiltredData = () => ({ type: CLEAR_FILTRED_DATA });

// Універсальні bookmarks/action creators
export const toggleDept = (menu, deptName, sections = []) => ({
  type: BOOKMARKS_DEPARTMENTS_CHANGED, menu, deptName, sections
});
export const toggleSubDept = (menu, deptName, sub) => ({ 
  type: BOOKMARKS_SECTIONS_CHANGED, menu, deptName, sub 
});
export const toggleHideUsersWithoutSections = (menu, deptName) => ({ type: TOGGLE_HIDE_USERS_WITHOUT_SECTIONS, menu, deptName });
export const toggleHideSections = (menu, deptName) => ({ type: TOGGLE_HIDE_SECTIONS, menu, deptName });
export const toggleAutoSelectHideUsersWithoutSections = (menu) => ({ type: TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS, menu });
export const toggleAutoSelectHideSections = (menu) => ({ type: TOGGLE_AUTO_SELECT_HIDE_SECTIONS, menu });
export const toggleAllDepatrments = (menu, departments) => ({ type: TOGGLE_ALL_DEPARTMENTS, menu, departments });


