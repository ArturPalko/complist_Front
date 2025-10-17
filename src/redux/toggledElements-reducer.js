const TOGGLE_SEARCH_FIELD_ELEMENT = "TOGGLE_SEARCH_FIELD_ELEMENT";
const ADD_FOUND_ITEMS = "ADD_FOUND_ITEMS";

const initialState = {
  showSearchField: { isActive: false },
  searchField: {
    "gov-ua": { searchValue: "", foundResults: [] },
    lotus: { searchValue: "", foundResults: [] },
    phones: { searchValue: "", foundResults: [] }
  }
};

export const toggledElemetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH_FIELD_ELEMENT:
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

    case ADD_FOUND_ITEMS:
      return {
        ...state,
        searchField: {
          ...state.searchField,
          [action.activeMenu]: {
            ...state.searchField[action.activeMenu],
            searchValue: action.searchValue || "",
            foundResults: action.foundResults || []
            
          }
        }
      };

    default:
      return state;
  }
};

export const toggleSearchFieldActionCreator = (value) => ({
  type: TOGGLE_SEARCH_FIELD_ELEMENT,
  value
});

export const addFoundItems = (activeMenu, searchValue, foundResults) => ({
  type: ADD_FOUND_ITEMS,
  activeMenu,
  searchValue,
  foundResults
});

