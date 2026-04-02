import { activeMenu } from "../selectors/selector";
import { isAnyFilterApplied } from "./filter-data-reducer/isAnyFIilterApplied";

const ADD_FILTRED_DATA = "ADD_FILTRED_DATA";
const SET_SUBFILTERS = "SET_SUBFILTERS";
const CLEAR_FILTRED_STATE_FOR_CURRENT_FORM = "CLEAR_FILTRED_STATE_FOR_CURRENT_FORM";
const ADD_INDEXES_OF_FILTRED_RESULTS = "ADD_INDEXES_OF_FILTRED_RESULTS";
const CLEAR_FILTRED_DATA = "CLEAR_FILTRED_DATA";

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

export const initialState = {
  "Gov-ua": createMenuState("Gov-ua"),
  Lotus: createMenuState("Lotus"),
  phones: createMenuState("phones")
};

// ================== REDUCER ==================
export const filterDataReducer = (state = initialState, action) => {
  debugger
  const { menu, deptName, sub, filter, variety, values, checked, departments } = action;
  const activeMenu = menu || "phones"; // fallback для старих action

  switch (action.type) {
    case "TOGGLE_ALL_DEPARTMENTS": {
      debugger
  const bookmarks = state[action.menu].bookmarks;

  const allSelected =
    Object.keys(bookmarks.selectedSubDepts).length === departments.length;

  let selectedSubDepts = {};
  let selectedOrder = [];
  let hideUsersWithoutSections = { ...bookmarks.hideUsersWithoutSections };
  let hideSections = { ...bookmarks.hideSections };

  if (!allSelected) {
    // вибираємо всі департаменти
    departments.forEach(dept => {
      const deptName = dept.departmentName || dept.name;
      const sections = dept.sections || [];

      if (sections.length === 0) {
        selectedSubDepts[deptName] = true;
      } else {
        selectedSubDepts[deptName] = sections.map(s => s.sectionName);
      }

      selectedOrder.push(deptName);

      // якщо увімкнено глобальні hide
      if (bookmarks.allHideUsersWithoutSections && sections.length !== 0) {
        hideUsersWithoutSections[deptName] = true;
      }
      if (bookmarks.allHideSections && sections.length !== 0) {
        hideSections[deptName] = true;
      }
    });
  }

  // якщо всі вже вибрані, очищаємо
  if (allSelected) {
    selectedSubDepts = {};
    selectedOrder = [];
    hideUsersWithoutSections = {};
    hideSections = {};
  }

  const newBookmarks = {
    ...bookmarks,
    selectedSubDepts,
    selectedOrder,
    hideUsersWithoutSections,
    hideSections
  };

  return {
    ...state,
    [activeMenu]: {
      ...state[activeMenu],
      bookmarks: newBookmarks,
      isFilterApplied: isAnyFilterApplied({ ...state[activeMenu], bookmarks: newBookmarks })
    }
  };
}

    // ===== AUTO SELECT HIDE =====
    case "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS": {
      const bookmarks = state[activeMenu].bookmarks;
      const selectedSubDepts = bookmarks.selectedSubDepts;
      const isCurrentlyOff = !bookmarks.allHideUsersWithoutSections;

      const newHideUsers = isCurrentlyOff
        ? Object.fromEntries(
            Object.entries(selectedSubDepts)
              .filter(([_, value]) => Array.isArray(value))
              .map(([key]) => [key, true])
          )
        : {};

      return {
        ...state,
        [activeMenu]: {
          ...state[activeMenu],
          bookmarks: {
            ...bookmarks,
            allHideUsersWithoutSections: !bookmarks.allHideUsersWithoutSections,
            hideUsersWithoutSections: newHideUsers
          }
        }
      };
    }

    case "TOGGLE_AUTO_SELECT_HIDE_SECTIONS": {
      const bookmarks = state[activeMenu].bookmarks;
      const selectedSubDepts = bookmarks.selectedSubDepts;
      const isCurrentlyOff = !bookmarks.allHideSections;

      const newHideSections = isCurrentlyOff
        ? Object.fromEntries(
            Object.entries(selectedSubDepts)
              .filter(([_, value]) => Array.isArray(value))
              .map(([key]) => [key, true])
          )
        : {};

      return {
        ...state,
        [activeMenu]: {
          ...state[activeMenu],
          bookmarks: {
            ...bookmarks,
            allHideSections: !bookmarks.allHideSections,
            hideSections: newHideSections
          }
        }
      };
    }

    // ===== BOOKMARKS =====
    case "TOGGLE_SUB_DEPT": {
      debugger
      const bookmarks = state[action.activeMenu].bookmarks;
      const selectedSubDepts = { ...bookmarks.selectedSubDepts };
      let selectedOrder = [...bookmarks.selectedOrder];
      debugger;

      const currentSubs = selectedSubDepts[deptName] || [];
      const newSubs = currentSubs.includes(sub)
        ? currentSubs.filter(s => s !== sub)
        : [...currentSubs, sub];

      if (newSubs.length === 0) {
        delete selectedSubDepts[deptName];
        selectedOrder = selectedOrder.filter(d => d !== deptName);
      } else {
        selectedSubDepts[deptName] = newSubs;
        if (!selectedOrder.includes(deptName)) selectedOrder.push(deptName);
      }

      const hideUsersWithoutSections = { ...bookmarks.hideUsersWithoutSections };
      const hideSections = { ...bookmarks.hideSections };

      if (newSubs.length > 0) {
        if (bookmarks.allHideUsersWithoutSections) hideUsersWithoutSections[deptName] = true;
        if (bookmarks.allHideSections) hideSections[deptName] = true;
      } else {
        delete hideUsersWithoutSections[deptName];
        delete hideSections[deptName];
      }
debugger
      return {
        ...state,
        [action.activeMenu]: {
          ...state[activeMenu],
          bookmarks: {
            ...bookmarks,
            selectedSubDepts,
            selectedOrder,
            hideUsersWithoutSections,
            hideSections
          },
          isFilterApplied: isAnyFilterApplied({
            ...state[activeMenu],
            bookmarks: {
              ...bookmarks,
              selectedSubDepts,
              selectedOrder,
              hideUsersWithoutSections,
              hideSections
            }
          })
        }
      };
    }

 case "SET_BOOKMARK": {
  const bookmarks = state[activeMenu].bookmarks;
  const selectedSubDepts = { ...bookmarks.selectedSubDepts };
  let selectedOrder = [...bookmarks.selectedOrder];

  const allSubs = action.sections || [];
  const selectedSubs = selectedSubDepts[deptName] || [];

  // Обробка вибору/зняття всіх секцій
  if (allSubs.length === 0) {
    if (selectedSubDepts[deptName]) {
      delete selectedSubDepts[deptName];
      selectedOrder = selectedOrder.filter(d => d !== deptName);
    } else {
      selectedSubDepts[deptName] = true; // для департаментів без секцій
      if (!selectedOrder.includes(deptName)) selectedOrder.push(deptName);
    }
  } else {
    if (selectedSubs.length === allSubs.length) {
      delete selectedSubDepts[deptName];
    } else {
      selectedSubDepts[deptName] = allSubs.map(s => s.sectionName);
    }
    selectedOrder = selectedOrder.filter(d => d !== deptName);
    if (selectedSubDepts[deptName]) selectedOrder.push(deptName);
  }

  const hideUsersWithoutSections = { ...bookmarks.hideUsersWithoutSections };
  const hideSections = { ...bookmarks.hideSections };

  // ✅ Авто ховання застосовується тільки до департаментів з секціями
  const hasSections = Array.isArray(selectedSubDepts[deptName]);

  if (bookmarks.allHideUsersWithoutSections && hasSections) {
    hideUsersWithoutSections[deptName] = true;
  } else {
    delete hideUsersWithoutSections[deptName];
  }

  if (bookmarks.allHideSections && hasSections) {
    hideSections[deptName] = true;
  } else {
    delete hideSections[deptName];
  }

  return {
    ...state,
    [activeMenu]: {
      ...state[activeMenu],
      bookmarks: {
        ...bookmarks,
        selectedSubDepts,
        selectedOrder,
        hideUsersWithoutSections,
        hideSections
      },
      isFilterApplied: isAnyFilterApplied({
        ...state[activeMenu],
        bookmarks: {
          ...bookmarks,
          selectedSubDepts,
          selectedOrder,
          hideUsersWithoutSections,
          hideSections
        }
      })
    }
  };
}

    // ===== TOGGLE CHECKBOXES =====
    case "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS": {
      const bookmarks = state[activeMenu].bookmarks;
      const current = bookmarks.hideUsersWithoutSections[deptName] || false;

      return {
        ...state,
        [activeMenu]: {
          ...state[activeMenu],
          bookmarks: {
            ...bookmarks,
            hideUsersWithoutSections: {
              ...bookmarks.hideUsersWithoutSections,
              [deptName]: !current
            }
          }
        }
      };
    }

    case "TOGGLE_HIDE_SECTIONS": {
      debugger
      const bookmarks = state[activeMenu].bookmarks;
      debugger
      const current = bookmarks.hideSections[deptName] || false;
      debugger

      return {
        ...state,
        [activeMenu]: {
          ...state[activeMenu],
          bookmarks: {
            ...bookmarks,
            hideSections: {
              ...bookmarks.hideSections,
              [deptName]: !current
            }
          }
        }
      };
    }

    // ===== FILTERS =====
    case ADD_FILTRED_DATA: {
      const { subFilters, ...rest } = state[activeMenu].usedFilters;
      const newUsedFilters = { ...rest, [filter]: !rest[filter], subFilters };

      return {
        ...state,
        [activeMenu]: {
          ...state[activeMenu],
          usedFilters: newUsedFilters,
          isFilterApplied:
            activeMenu === "phones"
              ? isAnyFilterApplied({ ...state[activeMenu], usedFilters: newUsedFilters })
              : Object.values(newUsedFilters).some(Boolean)
        }
      };
    }

    case SET_SUBFILTERS: {
      if (activeMenu !== "phones") return state;

      const currentVariety = state[activeMenu].usedFilters.subFilters?.[variety] || {};
      const newVariety = { ...currentVariety };

      values.forEach(value => {
        newVariety[value] = checked === null ? !currentVariety[value] : checked;
      });

      const newSubFilters = { ...state[activeMenu].usedFilters.subFilters, [variety]: newVariety };
      const newUsedFilters = { ...state[activeMenu].usedFilters, subFilters: newSubFilters };

      return {
        ...state,
        [activeMenu]: {
          ...state[activeMenu],
          usedFilters: newUsedFilters,
          isFilterApplied: isAnyFilterApplied({ ...state[activeMenu], usedFilters: newUsedFilters })
        }
      };
    }

    // ===== CLEAR =====
    case CLEAR_FILTRED_STATE_FOR_CURRENT_FORM: {
      if (activeMenu === "phones") {
        const newPhonesState = {
          usedFilters: {
            ...Object.fromEntries(
              Object.keys(state[activeMenu].usedFilters)
                .filter(k => k !== "subFilters")
                .map(k => [k, false])
            ),
            subFilters: { contactType: {}, userPosition: {} }
          },
          bookmarks: {
            selectedSubDepts: {},
            selectedOrder: [],
            hideUsersWithoutSections: {},
            hideSections: {}
          },
          filtredResults: []
        };

        return {
          ...state,
          [activeMenu]: { ...newPhonesState, isFilterApplied: false }
        };
      }

      const clearedFilters = Object.fromEntries(
        Object.keys(state[activeMenu].usedFilters).map(k => [k, false])
      );

      return {
        ...state,
        [activeMenu]: { usedFilters: clearedFilters, filtredResults: [], isFilterApplied: false }
      };
    }

    // ===== RESULTS =====
    case ADD_INDEXES_OF_FILTRED_RESULTS: {
      const currentStateForMenu = state[activeMenu];
      return {
        ...state,
        [activeMenu]: { ...currentStateForMenu, filtredResults: action.filtredIndexesOfFoundResults }
      };
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

// 🔹 Універсальні bookmarks/action creators
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