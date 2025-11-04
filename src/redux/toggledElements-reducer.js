const TOGGLE_SEARCH_FIELD_ELEMENT = "TOGGLE_SEARCH_FIELD_ELEMENT";
const TOGGLE_PAGES_NAVBAR_LINK = "TOGGLE_PAGES_NAVBAR_LINK";
const ADD_FOUND_ITEMS = "ADD_FOUND_ITEMS";
const CLEAR_SEARCH_FORM = "CLEAR_SEARCH_FORM";

const initialState = {
  showSearchField: { isActive: false },
  pagesNavbarLinkElementOnCurrentPage: {isPressed:false},
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

      case TOGGLE_PAGES_NAVBAR_LINK:
        return {
          ...state,
          pagesNavbarLinkElementOnCurrentPage :{
            ...state.pagesNavbarLinkElementOnCurrentPage,
            isPressed:action.value

          }
        }

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

   case CLEAR_SEARCH_FORM:
      return {
        ...state,
        searchField: {
          ...state.searchField,
          [action.activeMenu]: {
            ...state.searchField[action.activeMenu],
            searchValue: "",
            foundResults: [],
          },
        },
      };

    

    default:
      return state;
  }
};

export const toggleSearchFieldActionCreator = (value) => ({
  type: TOGGLE_SEARCH_FIELD_ELEMENT,
  value
});

export const togglepagesNavbarLinkElementOnCurrentPage= (value)=>({
  type:TOGGLE_PAGES_NAVBAR_LINK,
  value
})

export const addFoundItems = (activeMenu, searchValue, foundResults) => ({
  type: ADD_FOUND_ITEMS,
  activeMenu,
  searchValue,
  foundResults
});


export const clearSearchForm = (activeMenu) => ({
  type: CLEAR_SEARCH_FORM,
  activeMenu
});