const TOGGLE_FIELTER_PANEL_ELEMENT = "TOGGLE_FIELTER_PANEL_ELEMENT"
const TOGGLE_SEARCH_FIELD_ELEMENT = "TOGGLE_SEARCH_FIELD_ELEMENT";
const TOGGLE_PAGES_NAVBAR_LINK = "TOGGLE_PAGES_NAVBAR_LINK";
const ADD_FOUND_ITEMS = "ADD_FOUND_ITEMS";
const CLEAR_SEARCH_FORM = "CLEAR_SEARCH_FORM";
const CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS = "CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS";
const UPDATE_DRAFT_VALUE = "UPDATE_DRAFT_VALUE";

const initialState = {
  showSearchField: { isActive: false },
  showFilterPanel: { isActive: false },
  pagesNavbarLinkElementOnCurrentPage: {isPressed:false},
  searchField: {
    "Gov-ua": { draftValue: "", searchValue: "", foundResults: [] },
    Lotus: { draftValue: "", searchValue: "", foundResults: [] },
    phones: {draftValue: "", searchValue: "", foundResults: [] }
  }
};

export const toggledElemetsReducer = (state = initialState, action) => {
  switch (action.type) {

     case TOGGLE_FIELTER_PANEL_ELEMENT:
      return {
        ...state,
        showFilterPanel: {
          ...state.showFilterPanel,
          isActive:
            action.value !== undefined
              ? action.value
              : !state.showFilterPanel.isActive
        }
      };

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
    case UPDATE_DRAFT_VALUE:
    return {
      ...state,
      searchField: {
        ...state.searchField,
        [action.activeMenu]: {
          ...state.searchField[action.activeMenu],
          draftValue: action.draftValue
        }
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
        draftValue: action.searchValue || "", 
        foundResults: action.foundResults || []
      }
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
            foundResults: action.foundResults || [],
            draftValue:""
            
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
            draftValue:""
          },
        },
      };
    
    case CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS: 
    return {
      ...state,
      searchField: {
        "Gov-ua": { searchValue: "", foundResults: [] },
        lotus: { searchValue: "", foundResults: [] },
        phones: { searchValue: "", foundResults: [] }
      }
    };
    

    default:
      return state;
  }
};

export const toggleFielterPanelElement = (value) => ({
  type: TOGGLE_FIELTER_PANEL_ELEMENT,
  value
});

export const toggleSearchFieldActionCreator = (value) => ({
  type: TOGGLE_SEARCH_FIELD_ELEMENT,
  value
});

export const togglepagesNavbarLinkElementOnCurrentPage= (value)=>({
  type:TOGGLE_PAGES_NAVBAR_LINK,
  value
})

export const updateDraftValue = (activeMenu, draftValue) => ({
  type: UPDATE_DRAFT_VALUE,
  activeMenu,
  draftValue
});


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

export const clearSearchFieldsAndFoundResults = () => ({ type: CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS });
