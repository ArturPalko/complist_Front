const REMEMBER_CURRENT_PAGE_NUMBER = "REMEMBER_CURRENT_PAGE_NUMBER";
const SET_PREVIOUS_LOCATION = "SET_PREVIOUS_LOCATION";

const initialState = {
    activeMenu: "",
    Lotus: {digitPage:1, lastVisitedPage:1},
    "Gov-ua": {digitPage:1, lastVisitedPage:1},
    phones: {digitPage:1, lastVisitedPage:1},
    previousLocation:""
};

export const pagesNavbarReducer = (state = initialState, action) => {
    switch(action.type) {
        case REMEMBER_CURRENT_PAGE_NUMBER:
           
            const pageName = action.pageName;  
            const value = action.pageNumber; // сюди передаєш page/{number} або "foundResults"

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