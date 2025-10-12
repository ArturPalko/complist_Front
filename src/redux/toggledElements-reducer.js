const TOGGLE_SEARCH_FIELD_ELEMENT ="TOGGLE_SEARCH_FIELD_ELEMENT";
const TOGGLE_PASSWORD_FIELD_ELEMENT ="TOGGLE_PASSWORD_FIELD_ELEMENT";

const initialState = {
  showPasswords: { isActive: false },
  showSearchField: { isActive: true },
  searchField: {
    "gov-ua": { searchValue: "", foundResults: { pageIndex: null, rows: [] } },
    "lotus": { searchValue: "", foundResults: { pageIndex: null, rows: [] } },
    "phones": { searchValue: "", foundResults: { pageIndex: null, rows: [] } },
  },
  passwords:[]
};



export const toggledElemetsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Тоглити показ поля пошуку для всього showSearchField
    case TOGGLE_SEARCH_FIELD_ELEMENT :
      return {
        ...state,
        showSearchField: {
          ...state.showSearchField,
          isActive:
            action.value !== undefined
              ? action.value
              : !state.showSearchField.isActive
        }
      };

    case TOGGLE_PASSWORD_FIELD_ELEMENT:
      return {
        ...state,
        showPasswords: {
          ...state.showPasswords,
          isActive:
            action.value !== undefined
              ? action.value
              : !state.showPasswords.isActive
        }
      };

      default:
        return state;
    
  }
};

export const toggleSearchFieldActionCreator = (value) => {
  console.log("toggle запущено", value);
  return {
    type: "TOGGLE_SEARCH_FIELD_ELEMENT",
    value      
  };
};




