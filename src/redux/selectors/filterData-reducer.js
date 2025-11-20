const ADD_FILTRED_DATA= "ADD_FILTRED_DATA";
const CLEAR_FILTRED_STATE_FOR_CURRENT_FORM = "CLEAR_FILTRED_STATE_FOR_CURRENT_FORM";

const initialState = {
    "Gov-ua": {usedFilters:{personalMails:false, departmentMails:false, sectionMails: false, 
        hasResponsible:false, passworKnown:false,hasNoResponsible:false, passwordUnknown:false}, filtredResults:[]},
    Lotus: {usedFilters:{personalMails:false, departmentMails:false, hasPrevioustName: false, hasNewPostName:false,
         passworKnown:false,passwordUnknown:false}, filtredResults:[]},
    phones: {usedFilters:{personalMails:false, departmentMails:false, hasResponsible:false, passworKnow:false}, filtredResults:[]},
};

export const filterDataReducer = (state=initialState,action) =>{
    switch(action.type){
        case ADD_FILTRED_DATA:
            return{
                ...state,
                [action.menu]:{
                    ... state[action.menu],
                    usedFilters: {...state[action.menu].usedFilters,
                            [action.filter]: !state[action.menu].usedFilters[action.filter]      
                    },
                   
                }
            }
        case CLEAR_FILTRED_STATE_FOR_CURRENT_FORM: {
    return {
        ...state,
        [action.menu]: {
            usedFilters: Object.fromEntries(
                Object.keys(state[action.menu].usedFilters).map(key => [key, false])
            ),
            filtredResults: []
        }
    };
}

        default:
            return state;

    }

}


export const addFilter = (menu, filter) => ({
    type: ADD_FILTRED_DATA ,
    menu,
    filter
});

export const clearCurrentForm = (menu, filter) => ({
    type: CLEAR_FILTRED_STATE_FOR_CURRENT_FORM ,
    menu,
});