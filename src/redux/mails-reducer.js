const ADD_MAILS = "ADD_MAILS"


const initialState = {
    mails: {}
};

export const mailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_MAILS  :
             const limitRows = 18;
                let countRows = 0;
                let pageIndex = 1;
                let pages = [];
                let page = { pageIndex, rows: [] };
                function savePage() {
                pages.push(page);
                page = { pageIndex: ++pageIndex, rows: [] };
                countRows = 0;
            }

                for(const mail of action.data){
                    page.rows.push(mail)
                    countRows++
                    if (countRows >= limitRows) savePage();

                }
            return {
                ...state,
                mails: {
                    ...state.mails,
                    [action.mailType]: pages
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

