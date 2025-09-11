const ADD_MAILS = "ADD_MAILS"


const initialState = {
    mails: {}
};

export const mailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_MAILS  :
            return {
                ...state,
                mails: {
                    ...state.mails,
                    [action.mailType]: action.data
                }
            };
        default:
            return state;
    }
};

export const addMailsActionCreator = (mailType, data) => ({
    type: ADD_MAILS ,
    mailType,
    data
});
