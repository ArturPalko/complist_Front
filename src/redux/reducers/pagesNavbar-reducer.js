const REMEMBER_CURRENT_PAGE_NUMBER = "REMEMBER_CURRENT_PAGE_NUMBER";
const SET_PREVIOUS_LOCATION = "SET_PREVIOUS_LOCATION";
const SET_FILTER_PAGE = "SET_FILTER_PAGE";
const SET_LAST_VISITED_PAGE ="SET_LAST_VISITED_PAGE";

const initialState = {
    activeMenu: "",
    Lotus: {digitPage:1, lastVisitedPage:1, filterPage:1},
    "Gov-ua": {digitPage:1, lastVisitedPage:1, filterPage:1},
    phones: {digitPage:1, lastVisitedPage:1, filterPage:1},
    previousLocation:"",
    dictionary:{
  positions: {
    digitPage: 1,
    lastVisitedPage: 1,
  },

  userTypes: {
    digitPage: 1,
    lastVisitedPage: 1,
  },

  departments: {
    digitPage: 1,
    lastVisitedPage: 1,
  },

  sections: {
    digitPage: 1,
    lastVisitedPage: 1,
  },
}
}

export const pagesNavbarReducer = (state = initialState, action) => {
    switch(action.type) {
case REMEMBER_CURRENT_PAGE_NUMBER: {
    const pageName = action.pageName;
    const currentMode = action.currentMode;
    const value = action.pageNumber;
    const isNumberPage = !isNaN(Number(value));
    console.log("CURRENTMODEinreducer:", currentMode)
    if (pageName === "dictionary") {

    if (!currentMode) {
        return state;
    }

    return {
        ...state,

        dictionary: {
            ...state.dictionary,

            [currentMode]: {
                ...state.dictionary[currentMode],

                lastVisitedPage: value,

                digitPage: isNumberPage
                    ? Number(value)
                    : state.dictionary[currentMode].digitPage
            }
        }
    };
}

    return {
        ...state,
        activeMenu: pageName,

        [pageName]: {
            ...state[pageName],

            lastVisitedPage: value,

            digitPage: isNumberPage
                ? Number(value)
                : state[pageName].digitPage
        }
    };
}

case SET_FILTER_PAGE: {
    const pageNumber =
        typeof action.pageNumber === "number"
            ? action.pageNumber
            : Number(action.pageNumber);

    if (action.pageName === "dictionary") {
        return state;
    }
    

    return {
        ...state,
        activeMenu: action.pageName,

        [action.pageName]: {
            ...state[action.pageName],

            filterPage: !isNaN(pageNumber)
                ? pageNumber
                : state[action.pageName].filterPage
        }
    };
}
 case SET_PREVIOUS_LOCATION:
            return {
                ...state,
                previousLocation: action.previousLocation
            };
        case SET_FILTER_PAGE: {
        const pageNumber =
            typeof action.pageNumber === "number"
            ? action.pageNumber
            : Number(action.pageNumber);

        return {
            ...state,
            activeMenu: action.pageName,
            [action.pageName]: {
            ...state[action.pageName],
            filterPage: !isNaN(pageNumber) ? pageNumber : state[action.pageName].filterPage
            }
        };
        }
        
case SET_LAST_VISITED_PAGE: {
    if (action.pageName === "dictionary") {
        return {
            ...state,
            activeMenu: action.pageName,

            dictionary: {
                ...state.dictionary,

                [action.currentMode]: {
                    ...state.dictionary[action.currentMode],

                    lastVisitedPage: action.pageNumber
                }
            }
        };
    }

    return {
        ...state,
        activeMenu: action.pageName,

        [action.pageName]: {
            ...state[action.pageName],

            lastVisitedPage: action.pageNumber
        }
    };
}
 default:
    return state;
    }
};   

export const rememberCurrentPagesActionCreator = (
    pageName,
    pageNumber,
    currentMode
) => ({
    type: REMEMBER_CURRENT_PAGE_NUMBER,
    pageName,
    pageNumber,
    currentMode
});

export const setFilterPage = (
    pageName,
    pageNumber,
    currentMode
) => ({
    type: SET_FILTER_PAGE,
    pageName,
    pageNumber,
    currentMode
});

export const setLastVisitedPage = (
    pageName,
    pageNumber,
    currentMode
) => ({
    type: SET_LAST_VISITED_PAGE,
    pageName,
    pageNumber,
    currentMode
});
export const rememberPreviousLocationActionCreator = (previousLocation) => ({
    type: SET_PREVIOUS_LOCATION,
    previousLocation
});