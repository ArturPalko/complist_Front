const REMEMBER_CURRENT_PAGE_NUMBER = "REMEMBER_CURRENT_PAGE_NUMBER";
const SET_PREVIOUS_LOCATION = "SET_PREVIOUS_LOCATION";
const SET_FILTER_PAGE = "SET_FILTER_PAGE";
const SET_LAST_VISITED_PAGE ="SET_LAST_VISITED_PAGE";

const initialState = {
    activeMenu: "",
    Lotus: {digitPage:1, lastVisitedPage:1, filterPage:1},
    "Gov-ua": {digitPage:1, lastVisitedPage:1, filterPage:1},
    phones: {digitPage:1, lastVisitedPage:1, filterPage:1},
    previousLocation:""
};

export const pagesNavbarReducer = (state = initialState, action) => {
    switch(action.type) {
        case REMEMBER_CURRENT_PAGE_NUMBER:
           
            const pageName = action.pageName;  
            const value = action.pageNumber; 
            const isNumberPage = !isNaN(Number(value));

            return {
                ...state,
                activeMenu: pageName,

                [pageName]: {
                    ...state[pageName],
                    lastVisitedPage: value,
                    digitPage: isNumberPage ? Number(value) : state[pageName].digitPage
                }
            };
        
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
             case SET_LAST_VISITED_PAGE:
            return {
                ...state,
                activeMenu: action.pageName,
                [action.pageName]: {
                    ...state[action.pageName],
                    lastVisitedPage: action.pageNumber
                }
            };





        default:
            return state;
    }
};

export const rememberCurrentPagesActionCreator = (pageName, pageNumber) => ({
    type: REMEMBER_CURRENT_PAGE_NUMBER,
    pageName,
    pageNumber
});

export const rememberPreviousLocationActionCreator = (previousLocation) => ({
    type: SET_PREVIOUS_LOCATION,
    previousLocation
});

export const setFilterPage = (pageName, pageNumber) => ({
    type: SET_FILTER_PAGE,
    pageName,
    pageNumber
});

export const setLastVisitedPage = (pageName, pageNumber) => ({
    type: SET_LAST_VISITED_PAGE,
    pageName,
    pageNumber
});


