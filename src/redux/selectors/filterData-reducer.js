const ADD_FILTRED_DATA = "ADD_FILTRED_DATA";
const ADD_FILTRED_DATA_SUBCONDITIONS = "ADD_FILTRED_DATA_SUBCONDITIONS";
const CLEAR_FILTRED_STATE_FOR_CURRENT_FORM = "CLEAR_FILTRED_STATE_FOR_CURRENT_FORM";
const ADD_INDEXES_OF_FILTRED_RESULTS = "ADD_INDEXES_OF_FILTRED_RESULTS";


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
            passwordUnknown: false,
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
            subFilters:{contactType:[], userPosition:[] }
        },
        filtredResults: [],
        isFilterApplied: false
    },
};

export const filterDataReducer = (state = initialState, action) => {
    console.log("REDUCER STATE BEFORE:", state);
    switch (action.type) {
        case ADD_FILTRED_DATA: {
            debugger;
            
  console.log("ADD_FILTRED_DATA:", action.menu, action.filter);


            const newUsedFilters = {
                ...state[action.menu].usedFilters,
                [action.filter]: !state[action.menu].usedFilters[action.filter]
            };
            debugger;

            return {
                ...state,
                [action.menu]: {
                    ...state[action.menu],
                    usedFilters: newUsedFilters,
                    isFilterApplied: Object.values(newUsedFilters).some(Boolean)
                }
            };
        }

        case ADD_FILTRED_DATA_SUBCONDITIONS: {
  if (action.menu !== "phones") return state;

  const currentVariety = state.phones.usedFilters.subFilters[action.variety] || {};

  const newVariety = {
    ...currentVariety,
    [action.subKey]: !currentVariety[action.subKey]
  };

  return {
    ...state,
    phones: {
      ...state.phones,
      usedFilters: {
        ...state.phones.usedFilters,
        subFilters: {
          ...state.phones.usedFilters.subFilters,
          [action.variety]: newVariety
        }
      },
      isFilterApplied:
        Object.values(state.phones.usedFilters)
          .filter(v => typeof v === "boolean")
          .some(Boolean) ||
        Object.values(newVariety).some(Boolean)
    }
  };
}



        case CLEAR_FILTRED_STATE_FOR_CURRENT_FORM: {
            const clearedFilters = Object.fromEntries(
                Object.keys(state[action.menu].usedFilters).map(key => [key, false])
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

        case ADD_INDEXES_OF_FILTRED_RESULTS: {
            const currentStateForMenu = state[action.menu] ?? { usedFilters: {}, filtredResults: [], isFilterApplied: false };
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

// Action creators
export const addFilter = (menu, filter) => ({
    type: ADD_FILTRED_DATA,
    menu,
    filter
});


export const addFilteredDataSubconditions = (subKey, variety) => ({
    type: "ADD_FILTRED_DATA_SUBCONDITIONS",
    menu: "phones",   // сабумови тільки для phones
    subKey,
    variety
});


export const clearCurrentForm = (menu) => ({
    type: CLEAR_FILTRED_STATE_FOR_CURRENT_FORM,
    menu,
});

export const addIndexesOfFiltredResults = (menu, filtredIndexesOfFoundResults) => ({
    type: ADD_INDEXES_OF_FILTRED_RESULTS,
    menu,
    filtredIndexesOfFoundResults
});

