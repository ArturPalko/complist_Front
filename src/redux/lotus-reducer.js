
export const ADD_Lotus = "ADD-Lotusmails"

export let addGovUaMailsActionCreator = (lotusmails) => {
    return{
        type: ADD_Lotus,
        lotusmails
    }
}

const initialState = {
    lotusamails: []
};

export const lotusmailsReducer = (state=initialState, action) => {
    switch(action.type) {
        case ADD_Lotus:
            return { ...state, lotusamails:action.lotusamails};
        default:
            return state;
    }
}