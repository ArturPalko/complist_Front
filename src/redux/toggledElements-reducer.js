const TOGGLE_SEARCH_FIELD_ELEMENT ="TOGGLE_SEARCH_FIELD_ELEMENT";

const initialState = {
  searchField: {
    "gov-ua": { isPresented: false, searchValue: "", foundResults: { pageIndex: null, rows: [] } },
    "lotus": { isPresented: false, searchValue: "", foundResults: { pageIndex: null, rows: [] } },
    "phones": { isPresented: false, searchValue: "", foundResults: { pageIndex: null, rows: [] } }
  }

};



export const toggledElemetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_SEARCH_FIELD_ELEMENT":
      return {
        ...state,
        searchField: {
          ...state.searchField,
          [action.pageType]: {
            ...state.searchField[action.pageType],
            isPresented: action.value !== undefined ? action.value : !state.searchField[action.pageType].isPresented
          }
        }
      };

      default:
        return state;
    
  }
};

export const toggleSearchFieldActionCreator = (pageType) => ({
  type: TOGGLE_SEARCH_FIELD_ELEMENT,
  pageType
})



