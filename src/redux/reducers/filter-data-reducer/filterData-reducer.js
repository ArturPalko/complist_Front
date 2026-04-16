// =====================================================
//  EXTERNAL / SHARED IMPORTS
// =====================================================
import { activeMenu } from "../../selectors/selector";

// =====================================================
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
const ADD_FILTRED_DATA = "ADD_FILTRED_DATA";
const SET_SUBFILTERS = "SET_SUBFILTERS";
const CLEAR_FILTRED_STATE_FOR_CURRENT_FORM = "CLEAR_FILTRED_STATE_FOR_CURRENT_FORM";
const ADD_INDEXES_OF_FILTRED_RESULTS = "ADD_INDEXES_OF_FILTRED_RESULTS";
const CLEAR_FILTRED_DATA = "CLEAR_FILTRED_DATA";

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

  const activeMenu = menu || "phones";
debugger
  switch (action.type) {

    // =====================================================
    // BOOKMARKS: bulk operations
    // =====================================================
    case "TOGGLE_ALL_DEPARTMENTS": {
        return updateMenuState(state, activeMenu, menu => {
          const bookmarks = toggleAllDepartmentsLogic(menu, departments);
          return updateMenuWithBookmarks(menu, bookmarks);
      });
    }

    case "TOGGLE_SUB_DEPT": {
      return updateMenuState(state, activeMenu, menu => {
        const bookmarks = toggleSubDeptLogic(menu, deptName, sub);
        return updateMenuWithBookmarks(menu, bookmarks);
      });
    }

      case "SET_BOOKMARK": {
        return updateMenuState(state, activeMenu, menu => {
          const bookmarks = setBookmarkLogic(menu, deptName, sections);
          return updateMenuWithBookmarks(menu, bookmarks);
        });
      }

    // =====================================================
    // BOOKMARKS: toggle flags
    // =====================================================


    case "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS": {
      return updateMenuState(state, activeMenu, menu =>
        toggleBookmarkFlag(menu, "hideUsersWithoutSections", deptName)
      );
    }

    case "TOGGLE_HIDE_SECTIONS": {
      return updateMenuState(state, activeMenu, menu =>
        toggleBookmarkFlag(menu, "hideSections", deptName)
      );
    }

    // =====================================================
    // BOOKMARKS: auto-select logic
    // =====================================================

    case "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS": {
  return updateMenuState(state, activeMenu, menu =>
    toggleAutoHide(
      menu,
      "allHideUsersWithoutSections",
      "hideUsersWithoutSections"
    )
  );
}

   case "TOGGLE_AUTO_SELECT_HIDE_SECTIONS": {
  return updateMenuState(state, activeMenu, menu =>
    toggleAutoHide(
      menu,
      "allHideSections",
      "hideSections"
    )
  );
}

    // =====================================================
    // FILTERS
    // =====================================================
case ADD_FILTRED_DATA: {
  return updateMenuState(state, activeMenu, menu =>
    updateFilters(menu, {
      type: "mainFilters",
      filter
    })
  );
}
case SET_SUBFILTERS: {
  if (activeMenu !== "phones") return state;

  return updateMenuState(state, activeMenu, menu =>
    updateFilters(menu, {
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
  return updateMenuState(state, activeMenu, () =>
    createMenuState(activeMenu)
  );
}

    case CLEAR_FILTRED_DATA:
      return { ...initialState };

  case ADD_INDEXES_OF_FILTRED_RESULTS: {
    return updateMenuState(state, activeMenu, menu => ({
      ...menu,
      filtredResults: action.filtredIndexesOfFoundResults
    }));
  }

    default:
      return state;
  }
};
// ================== ACTION CREATORS ==================
export const addFilter = (menu, filter) => ({ type: ADD_FILTRED_DATA, menu, filter });
export const setSubFilters = (menu, variety, values, checked) => ({
  type: SET_SUBFILTERS, menu, variety, values, checked
});
export const clearCurrentForm = (menu) => ({ type: CLEAR_FILTRED_STATE_FOR_CURRENT_FORM, menu });
export const addIndexesOfFiltredResults = (menu, filtredIndexesOfFoundResults) => ({
  type: ADD_INDEXES_OF_FILTRED_RESULTS, menu, filtredIndexesOfFoundResults
});
export const clearFiltredData = () => ({ type: CLEAR_FILTRED_DATA });

// Універсальні bookmarks/action creators
export const setBookmark = (menu, deptName, sections = []) => ({
  type: "SET_BOOKMARK", menu, deptName, sections
});
export const toggleDept = (menu, deptName) => ({ type: "TOGGLE_DEPT", activeMenu, deptName });
export const toggleSubDept = (activeMenu, deptName, sub) => ({ type: "TOGGLE_SUB_DEPT", activeMenu, deptName, sub });
export const toggleHideUsersWithoutSections = (menu, deptName) => ({ type: "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS", menu, deptName });
export const toggleHideSections = (menu, deptName) => ({ type: "TOGGLE_HIDE_SECTIONS", menu, deptName });
export const toggleAutoSelectHideUsersWithoutSections = (menu) => ({ type: "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS", menu });
export const toggleAutoSelectHideSections = (menu) => ({ type: "TOGGLE_AUTO_SELECT_HIDE_SECTIONS", menu });
export const toggleAllDepatrments = (menu, departments) => ({ type: "TOGGLE_ALL_DEPARTMENTS", menu, departments });


