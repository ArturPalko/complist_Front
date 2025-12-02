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
            subFilters:[]
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
            NOThasCiscoPhone: false
        },
        filtredResults: [],
        isFilterApplied: false
    },
};

export const filterDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FILTRED_DATA: {
            const newUsedFilters = {
                ...state[action.menu].usedFilters,
                [action.filter]: !state[action.menu].usedFilters[action.filter]
            };

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
    if (action.menu !== "phones") return state; // сабумови тільки для phones

    // гарантуємо існування subFilters
    const currentSubFilters = state.phones.usedFilters.subFilters || {};

    const newSubFilters = {
        ...currentSubFilters,
        [action.subKey]: currentSubFilters[action.subKey] ? !currentSubFilters[action.subKey] : true
    };

    return {
        ...state,
        phones: {
            ...state.phones,
            usedFilters: {
                ...state.phones.usedFilters,
                subFilters: newSubFilters
            },
            isFilterApplied:
                Object.values(state.phones.usedFilters)
                    .filter(v => typeof v === "boolean")
                    .some(Boolean) ||
                Object.values(newSubFilters).some(Boolean)
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


export const addFilteredDataSubconditions = (subKey) => ({
    type: "ADD_FILTRED_DATA_SUBCONDITIONS",
    menu: "phones",   // сабумови тільки для phones
    subKey
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


