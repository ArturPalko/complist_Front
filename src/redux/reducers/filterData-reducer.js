const ADD_FILTRED_DATA = "ADD_FILTRED_DATA";
const ADD_FILTRED_DATA_SUBCONDITIONS = "ADD_FILTRED_DATA_SUBCONDITIONS";
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
        case CLEAR_FILTRED_DATA:
                return {
                    ...state,
                    "Gov-ua": { ...initialState["Gov-ua"] },
                    Lotus: { ...initialState["Lotus"] },
                    phones: { ...initialState["phones"] }
                };

 case ADD_FILTRED_DATA: {
    const { menu, filter } = action;

    // 🔹 якщо menu немає або filter немає — нічого не робимо
      if (!menu || menu === "" || !state[menu] || !filter) {
        return state;
    }
    const newUsedFilters = {
        ...state[menu].usedFilters,
        [filter]: !state[menu].usedFilters[filter] // toggle
    };
    let checking = Object.values(newUsedFilters).some(Boolean);

    return {
        ...state,
        [menu]: {
            ...state[menu],
            usedFilters: newUsedFilters,
            isFilterApplied: Object.values(newUsedFilters).some(Boolean)
        }
    };
}


     case ADD_FILTRED_DATA_SUBCONDITIONS: {
  if (action.menu !== "phones") return state;

  const currentVariety = state.phones.usedFilters.subFilters?.[action.variety] || {};

  const newVariety = {
    ...currentVariety,
    [action.subKey]: !currentVariety[action.subKey]
  };

  const newSubFilters = {
    ...state.phones.usedFilters.subFilters,
    [action.variety]: newVariety
  };

  const newUsedFilters = {
    ...state.phones.usedFilters,
    subFilters: newSubFilters
  };

  // Перевіряємо, чи є хоча б один активний фільтр
  const mainFiltersApplied = Object.values(newUsedFilters)
    .filter(v => typeof v === "boolean")
    .some(Boolean);

  const subFiltersApplied = Object.values(newSubFilters)
    .some(category =>
      Object.values(category || {}).some(Boolean)
    );

  return {
    ...state,
    phones: {
      ...state.phones,
      usedFilters: newUsedFilters,
      isFilterApplied: mainFiltersApplied || subFiltersApplied
    }
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
                            .map(key => [key, false])
                    ),
                    subFilters: { contactType: {}, userPosition: {} } // скидаємо сабкондішини
                },
                filtredResults: [],
                isFilterApplied: false
            }
        };
    }

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

export const clearFiltredData = () => ({
    type: CLEAR_FILTRED_DATA
});

