
export const ADD_GOVUA = "ADD-GOVUAmails"

export let addGovUaMailsActionCreator = (govuamails) => {
    return{
        type: ADD_GOVUA,
        govuamails
    }
}

const initialState = {
    govuamails: []
};

export const govuamailsReducer = (state=initialState, action) => {
    switch(action.type) {
        case ADD_GOVUA:
            return { ...state, govuamails:action.govuamails};
        default:
            return state;
    }
}