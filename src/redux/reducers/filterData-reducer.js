import { isAnyFilterApplied } from "./filter-data-reducer/isAnyFIilterApplied";

const ADD_FILTRED_DATA = "ADD_FILTRED_DATA";
const SET_SUBFILTERS = "SET_SUBFILTERS";
const CLEAR_FILTRED_STATE_FOR_CURRENT_FORM = "CLEAR_FILTRED_STATE_FOR_CURRENT_FORM";
const ADD_INDEXES_OF_FILTRED_RESULTS = "ADD_INDEXES_OF_FILTRED_RESULTS";
const CLEAR_FILTRED_DATA = "CLEAR_FILTRED_DATA";

const initialState = {
  "Gov-ua": {
    usedFilters: {
      personalMails: false,
      departmentMails: false,
      sectionMails: false,
      hasResponsible: false,
      passworKnown: false,
      hasNoResponsible: false,
      passwordUnknown: false
    },
    filtredResults: [],
    isFilterApplied: false
  },
  Lotus: {
    usedFilters: {
      personalMails: false,
      departmentMails: false,
      hasPrevioustName: false,
      hasNewPostName: false,
      passworKnown: false,
      passwordUnknown: false
    },
    filtredResults: [],
    isFilterApplied: false
  },
  phones: {
    usedFilters: {
      hasLadnlinePhone: false,
      hasInternalPhone: false,
      hasCiscoPhone: false,
      NOThasLadnlinePhone: false,
      NOThasInternalPhone: false,
      NOThasCiscoPhone: false,
      subFilters: { contactType: {}, userPosition: {} }
    },
    bookmarks: {
      selectedSubDepts: {},
      selectedOrder: [],
      allHideUsersWithoutSections:false,
      allHideSections:false,
      hideUsersWithoutSections: {},
      hideSections: {}
    },
    filtredResults: [],
    isFilterApplied: false
  }
};

export const filterDataReducer = (state = initialState, action) => {
  switch (action.type) {
// case "ALL_TOGGLE_HIDE_USERS_WITHOUT_SECTIONS": {
//   const selectedSubDepts = state.phones.bookmarks.selectedSubDepts;
//   const current = state.phones.bookmarks.hideUsersWithoutSections;

//   const isEmpty = Object.keys(current).length === 0;

//   const newValue = isEmpty
//     ? Object.fromEntries(
//         Object.entries(selectedSubDepts)
//           .filter(([_, value]) => Array.isArray(value))
//           .map(([key]) => [key, true])
//       )
//     : {}; // якщо вже є значення → очищаємо

//   return {
//     ...state,
//     phones: {
//       ...state.phones,
//       bookmarks: {
//         ...state.phones.bookmarks,
//         hideUsersWithoutSections: newValue
//       }
//     }
//   };
// }
case "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS": {
  const selectedSubDepts = state.phones.bookmarks.selectedSubDepts;

  // Якщо зараз false → увімкнути та скопіювати всі департаменти з масивами у hideUsersWithoutSections
  const isCurrentlyOff = !state.phones.bookmarks.allHideUsersWithoutSections;

  const newHideUsers = isCurrentlyOff
    ? Object.fromEntries(
        Object.entries(selectedSubDepts)
          .filter(([_, value]) => Array.isArray(value))
          .map(([key]) => [key, true])
      )
    : {}; // якщо вимкнути → очищаємо

  return {
    ...state,
    phones: {
      ...state.phones,
      bookmarks: {
        ...state.phones.bookmarks,
        allHideUsersWithoutSections: !state.phones.bookmarks.allHideUsersWithoutSections,
        hideUsersWithoutSections: newHideUsers
      }
    }
  };
}

case "TOGGLE_AUTO_SELECT_HIDE_SECTIONS": {
  const selectedSubDepts = state.phones.bookmarks.selectedSubDepts;

  // якщо зараз вимкнено → вмикаємо і заповнюємо
  const isCurrentlyOff = !state.phones.bookmarks.allHideSections;

  const newHideSections = isCurrentlyOff
    ? Object.fromEntries(
        Object.entries(selectedSubDepts)
          .filter(([_, value]) => Array.isArray(value))
          .map(([key]) => [key, true])
      )
    : {}; // якщо вимикаємо → очищаємо

  return {
    ...state,
    phones: {
      ...state.phones,
      bookmarks: {
        ...state.phones.bookmarks,
        allHideSections: !state.phones.bookmarks.allHideSections,
        hideSections: newHideSections
      }
    }
  };
}
    // ================= BOOKMARKS =================

    case "TOGGLE_SUB_DEPT": {
    
      const { deptName, sub } = action;
      const { bookmarks } = state.phones;

      const selectedSubDepts = { ...bookmarks.selectedSubDepts };
      let selectedOrder = [...bookmarks.selectedOrder];

      const currentSubs = selectedSubDepts[deptName] || [];
      

      let newSubs;
      if (currentSubs.includes(sub)) {
        newSubs = currentSubs.filter(s => s !== sub);
      } else {
        newSubs = [...currentSubs, sub];
      }

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
        if (bookmarks.allHideUsersWithoutSections) {
          hideUsersWithoutSections[deptName] = true;
        }

        if (bookmarks.allHideSections) {
          hideSections[deptName] = true;
        }
      } else {
        delete hideUsersWithoutSections[deptName];
        delete hideSections[deptName];
      }

      const newPhonesState = {
        ...state.phones,
        bookmarks: {
  ...bookmarks,
  selectedSubDepts,
  selectedOrder,
  hideUsersWithoutSections,
  hideSections
}
      };

      return {
        ...state,
        phones: {
          ...newPhonesState,
          isFilterApplied: isAnyFilterApplied(newPhonesState)
        }
      };
    }

    case "SET_BOOKMARK": {
  const { deptName, sections } = action;
  const { bookmarks } = state.phones;
debugger
  const selectedSubDepts = { ...bookmarks.selectedSubDepts };
  let selectedOrder = [...bookmarks.selectedOrder];

  const allSubs = sections || [];
  const selectedSubs = selectedSubDepts[deptName] || [];

  if (allSubs.length === 0) {
    debugger
    if (selectedSubDepts[deptName]) {
      debugger
      delete selectedSubDepts[deptName];
      selectedOrder = selectedOrder.filter(d => d !== deptName);
    } else {
      selectedSubDepts[deptName] = true;
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

  // 🔥 НОВА ЛОГІКА (симетрична)
  const hideUsersWithoutSections = { ...bookmarks.hideUsersWithoutSections };
  const hideSections = { ...bookmarks.hideSections };

  const isSelected = !!selectedSubDepts[deptName];
  debugger

  if (isSelected) {
    let b = allSubs.length!=0
    debugger
    if (bookmarks.allHideUsersWithoutSections && b) {
      debugger;
      hideUsersWithoutSections[deptName] = true;
    }
// let a =bookmarks.allHideUsersWithoutSections
// let b = !allSubs.length
// debugger
//     if (a &&  b ) {
//       debugger
//       hideUsersWithoutSections[deptName] = true;
//     }
 } 
else {
    delete hideUsersWithoutSections[deptName];
    delete hideSections[deptName];
  }

  const newPhonesState = {
    ...state.phones,
    bookmarks: {
      ...bookmarks,
      selectedSubDepts,
      selectedOrder,
      hideUsersWithoutSections,
      hideSections
    }
  };

  return {
    ...state,
    phones: {
      ...newPhonesState,
      isFilterApplied: isAnyFilterApplied(newPhonesState)
    }
  };
}

    // ================= CHECKBOXES ДЛЯ ДЕПАРТАМЕНТІВ =================

    case "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS": {
      const { deptName } = action;
      const current = state.phones.bookmarks.hideUsersWithoutSections[deptName] || false;

      return {
        ...state,
        phones: {
          ...state.phones,
          bookmarks: {
            ...state.phones.bookmarks,
            hideUsersWithoutSections: {
              ...state.phones.bookmarks.hideUsersWithoutSections,
              [deptName]: !current
            }
          }
        }
      };
    }

    case "TOGGLE_HIDE_SECTIONS": {
      const { deptName } = action;
      const current = state.phones.bookmarks.hideSections[deptName] || false;

      return {
        ...state,
        phones: {
          ...state.phones,
          bookmarks: {
            ...state.phones.bookmarks,
            hideSections: {
              ...state.phones.bookmarks.hideSections,
              [deptName]: !current
            }
          }
        }
      };
    }

    // ================= FILTERS =================

    case ADD_FILTRED_DATA: {
      const { menu, filter } = action;
      const { subFilters, ...rest } = state[menu].usedFilters;

      const newUsedFilters = {
        ...rest,
        [filter]: !rest[filter],
        subFilters
      };

      const newMenuState = {
        ...state[menu],
        usedFilters: newUsedFilters
      };

      return {
        ...state,
        [menu]: {
          ...newMenuState,
          isFilterApplied:
            menu === "phones"
              ? isAnyFilterApplied(newMenuState)
              : Object.values(newUsedFilters).some(Boolean)
        }
      };
    }

    case SET_SUBFILTERS: {
      if (action.menu !== "phones") return state;

      const currentVariety = state.phones.usedFilters.subFilters?.[action.variety] || {};
      const newVariety = { ...currentVariety };

      action.values.forEach(value => {
        if (action.checked === null) {
          newVariety[value] = !currentVariety[value];
        } else {
          newVariety[value] = action.checked;
        }
      });

      const newSubFilters = {
        ...state.phones.usedFilters.subFilters,
        [action.variety]: newVariety
      };

      const newUsedFilters = {
        ...state.phones.usedFilters,
        subFilters: newSubFilters
      };

      const newPhonesState = {
        ...state.phones,
        usedFilters: newUsedFilters
      };

      return {
        ...state,
        phones: {
          ...newPhonesState,
          isFilterApplied: isAnyFilterApplied(newPhonesState)
        }
      };
    }

    // ================= CLEAR =================

    case CLEAR_FILTRED_STATE_FOR_CURRENT_FORM: {
      if (action.menu === "phones") {
        const newPhonesState = {
          usedFilters: {
            ...Object.fromEntries(
              Object.keys(state.phones.usedFilters)
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
          phones: {
            ...newPhonesState,
            isFilterApplied: false
          }
        };
      }

      const clearedFilters = Object.fromEntries(
        Object.keys(state[action.menu].usedFilters).map(k => [k, false])
      );

      return {
        ...state,
        [action.menu]: {
          usedFilters: clearedFilters,
          filtredResults: [],
          isFilterApplied: false
        }
      };
    }

    // ================= RESULTS =================
case "TOGGLE_ALL_DEPARTMENTS": {
  const { departments } = action;
  const { bookmarks } = state.phones;

  const allSelected =
    Object.keys(bookmarks.selectedSubDepts).length === departments.length;

  let selectedSubDepts = {};
  let selectedOrder = [];
  let hideUsersWithoutSections = { ...bookmarks.hideUsersWithoutSections };

  if (!allSelected) {
    // 🔹 вибираємо всі департаменти
    departments.forEach(dept => {
      const deptName = dept.departmentName || dept.name; // залежить від структури
      const sections = dept.sections || [];

      if (sections.length === 0) {
        selectedSubDepts[deptName] = true;
      } else {
        selectedSubDepts[deptName] = sections.map(s => s.sectionName);
      }

      selectedOrder.push(deptName);

      // залишаємо hideUsersWithoutSections тільки для тих, хто вже має прапорець
      if (bookmarks.allHideUsersWithoutSections && sections.length !== 0) {
        hideUsersWithoutSections[deptName] = true;
      }
         if (bookmarks.allHideSections && sections.length !== 0) {
        hideUsersWithoutSections[deptName] = true;
      }
    });
  } else {
    // 🔹 якщо всі вже вибрані, очищаємо
    selectedSubDepts = {};
    selectedOrder = [];
    hideUsersWithoutSections = {};
  }

  const newBookmarks = {
    ...bookmarks,
    selectedSubDepts,
    selectedOrder,
    hideUsersWithoutSections
  };

  return {
    ...state,
    phones: {
      ...state.phones,
      bookmarks: newBookmarks,
      isFilterApplied: isAnyFilterApplied({
        ...state.phones,
        bookmarks: newBookmarks
      })
    }
  };
}
    case ADD_INDEXES_OF_FILTRED_RESULTS: {
      const currentStateForMenu = state[action.menu];
      return {
        ...state,
        [action.menu]: {
          ...currentStateForMenu,
          filtredResults: action.filtredIndexesOfFoundResults
        }
      };
    }

    

    default:
      return state;
  }
};

// ================= EXPORTS ACTION CREATORS =================

export const addFilter = (menu, filter) => ({ type: ADD_FILTRED_DATA, menu, filter });
export const setSubFilters = (menu, variety, values, checked) => ({
  type: SET_SUBFILTERS, menu, variety, values, checked
});
export const clearCurrentForm = (menu) => ({ type: CLEAR_FILTRED_STATE_FOR_CURRENT_FORM, menu });
export const addIndexesOfFiltredResults = (menu, filtredIndexesOfFoundResults) => ({
  type: ADD_INDEXES_OF_FILTRED_RESULTS, menu, filtredIndexesOfFoundResults
});
export const clearFiltredData = () => ({ type: CLEAR_FILTRED_DATA });
export const setBookmark = (deptName, sections = []) => ({
  type: "SET_BOOKMARK",
  deptName,
  sections
});
export const toggleDept = (deptName) => ({ type: "TOGGLE_DEPT", deptName });
export const toggleSubDept = (deptName, sub) => ({ type: "TOGGLE_SUB_DEPT", deptName, sub });
export const toggleHideUsersWithoutSections = (deptName) => ({
  type: "TOGGLE_HIDE_USERS_WITHOUT_SECTIONS",
  deptName
});
export const toggleHideSections = (deptName) => ({
  type: "TOGGLE_HIDE_SECTIONS",
  deptName
});





// export const toggleAllHideUsersWithoutSections = () => ({
//   type: "ALL_TOGGLE_HIDE_USERS_WITHOUT_SECTIONS",
  
// });
// export const toggleAllHideSections = () => ({
//   type: "ALL_TOGGLE_HIDE_SECTIONS",
// });

export const toggleAutoSelectHideUsersWithoutSections = () => ({
  type: "TOGGLE_AUTO_SELECT_HIDE_USERS_WITHOUT_SECTIONS"
});

export const toggleAutoSelectHideSections = () => ({
  type: "TOGGLE_AUTO_SELECT_HIDE_SECTIONS"
});

export const toggleAllDepatrments = (departments)=>({
  type: "TOGGLE_ALL_DEPARTMENTS",
  departments
})