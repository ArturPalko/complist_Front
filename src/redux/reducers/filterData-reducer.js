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
    filtredResults: [],
    isFilterApplied: false
  }
};

export const filterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_FILTRED_DATA:
      return { ...initialState };

    case ADD_FILTRED_DATA: {
      const { menu, filter } = action;
      const { subFilters, ...restFilters } = state[menu].usedFilters;
      const newUsedFilters = {
        ...restFilters,
        [filter]: !restFilters[filter]
      };
      const isFilterApplied = Object.values(newUsedFilters).some(Boolean) ||
        Object.values(subFilters || {}).some(category => Object.values(category || {}).some(Boolean));
      return {
        ...state,
        [menu]: { ...state[menu], usedFilters: { ...newUsedFilters, subFilters }, isFilterApplied }
      };
    }

    case SET_SUBFILTERS: {
      if (action.menu !== "phones") return state;

      const currentVariety = state.phones.usedFilters.subFilters?.[action.variety] || {};
      const newVariety = { ...currentVariety };

      action.values.forEach(value => {
        if (action.checked === null) {
          newVariety[value] = !currentVariety[value]; // toggle
        } else {
          newVariety[value] = action.checked; // explicit set
        }
      });

      const newSubFilters = { ...state.phones.usedFilters.subFilters, [action.variety]: newVariety };
      const newUsedFilters = { ...state.phones.usedFilters, subFilters: newSubFilters };

      const mainFiltersApplied = Object.values(newUsedFilters)
        .filter(v => typeof v === "boolean")
        .some(Boolean);

      const subFiltersApplied = Object.values(newSubFilters)
        .some(category => Object.values(category || {}).some(Boolean));

      return {
        ...state,
        phones: { ...state.phones, usedFilters: newUsedFilters, isFilterApplied: mainFiltersApplied || subFiltersApplied }
      };
    }

    case CLEAR_FILTRED_STATE_FOR_CURRENT_FORM: {
      if (action.menu === "phones") {
        return {
          ...state,
          phones: {
            usedFilters: {
              ...Object.fromEntries(
                Object.keys(state.phones.usedFilters)
                  .filter(k => k !== "subFilters")
                  .map(k => [k, false])
              ),
              subFilters: { contactType: {}, userPosition: {} }
            },
            filtredResults: [],
            isFilterApplied: false
          }
        };
      }

      const clearedFilters = Object.fromEntries(
        Object.keys(state[action.menu].usedFilters).map(k => [k, false])
      );
      return {
        ...state,
        [action.menu]: { usedFilters: clearedFilters, filtredResults: [], isFilterApplied: false }
      };
    }

    case ADD_INDEXES_OF_FILTRED_RESULTS: {
      const currentStateForMenu = state[action.menu] ?? { usedFilters: {}, filtredResults: [], isFilterApplied: false };
      return {
        ...state,
        [action.menu]: { ...currentStateForMenu, filtredResults: action.filtredIndexesOfFoundResults }
      };
    }

    default:
      return state;
  }
};

// Action creators
export const addFilter = (menu, filter) => ({ type: ADD_FILTRED_DATA, menu, filter });
export const setSubFilters = (menu, variety, values, checked) => ({
  type: SET_SUBFILTERS, menu, variety, values, checked
});
export const clearCurrentForm = (menu) => ({ type: CLEAR_FILTRED_STATE_FOR_CURRENT_FORM, menu });
export const addIndexesOfFiltredResults = (menu, filtredIndexesOfFoundResults) => ({
  type: ADD_INDEXES_OF_FILTRED_RESULTS, menu, filtredIndexesOfFoundResults
});
export const clearFiltredData = () => ({ type: CLEAR_FILTRED_DATA });
