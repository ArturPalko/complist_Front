const REMEMBER_CURRENT_PAGE_NUMBER = "REMEMBER_CURRENT_PAGE_NUMBER";

const initialState = {
    activeMemu: "",
    Lotus: 1,
    "Gov-ua": 1,
    phones: 1
};

export const pagesNavbarReducer = (state = initialState, action) => {
    switch(action.type) {
        case REMEMBER_CURRENT_PAGE_NUMBER:
            return {
                ...state,
                activeMemu:action.pageName,
                [action.pageName]: action.pageNumber
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
