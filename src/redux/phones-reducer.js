const ADD_PHONES = "ADD_PHONES"


const initialState = {
    phones: []
};

export const phonesReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_PHONES  :
            return {
                ...state,
                    phones: action.data
                
            };
        default:
            return state;
    }
};

export const addPhonesActionCreator = (data) => ({
    type: ADD_PHONES ,
    data
});
