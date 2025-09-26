const TOGGLE_VALUEOF_CHECKBOX ="TOGGLE_VALUEOF_CHECKBOX";

const initialState = {
    "showPasswords": { isActive: false },
    "showSearchField": { isActive:false },
};

export const topTableReducer = (state = initialState, action) =>{
    switch(action.type){
        case "TOGGLE_VALUEOF_CHECKBOX":
            return{
                ... state, [action.checkBoxId]: {
  ...state[action.checkBoxId],
  isActive: !state[action.checkBoxId].isActive
}

            }
        default:
            return state;
    }
    
    
}

export const rememberCkeckboxState = (checkBoxId) => ({
  type: TOGGLE_VALUEOF_CHECKBOX,
  checkBoxId
});

export const toggleChecboxActionCreator = (checkBoxId) => ({
  type: TOGGLE_VALUEOF_CHECKBOX,
  checkBoxId
})