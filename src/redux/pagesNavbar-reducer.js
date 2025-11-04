const REMEMBER_CURRENT_PAGE_NUMBER = "REMEMBER_CURRENT_PAGE_NUMBER";
const SET_PREVIOUS_LOCATION = "SET_PREVIOUS_LOCATION";

const initialState = {
    activeMenu: "",
    Lotus: 1,
    "Gov-ua": 1,
    phones: 1,
    previousLocation:""
};

export const pagesNavbarReducer = (state = initialState, action) => {
    switch(action.type) {
        case REMEMBER_CURRENT_PAGE_NUMBER:
            return {
                ...state,
                activeMenu:action.pageName,
                [action.pageName]: action.pageNumber
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