const TOGGLE_FIELTER_PANEL_ELEMENT = "TOGGLE_FIELTER_PANEL_ELEMENT";
const TOGGLE_SEARCH_FIELD_ELEMENT = "TOGGLE_SEARCH_FIELD_ELEMENT";
const TOGGLE_PAGES_NAVBAR_LINK = "TOGGLE_PAGES_NAVBAR_LINK";
const ADD_FOUND_ITEMS = "ADD_FOUND_ITEMS";
const CLEAR_SEARCH_FORM = "CLEAR_SEARCH_FORM";
const CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS =
  "CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS";
const UPDATE_DRAFT_VALUE = "UPDATE_DRAFT_VALUE";
const ADD_INDEXES_FROM_INDEXCELL = "ADD_INDEXES_FROM_INDEXCELL";

const createSearchState = () => ({
  draftValue: "",
  searchValue: "",
  foundResults: [],
  userSearchedOnce: false,
  lastSearchFound: true,
});

const initialState = {
  showSearchField: {
    isActive: false,
  },

  showFilterPanel: {
    isActive: false,
  },

  pagesNavbarLinkElementOnCurrentPage: {
    isPressed: false,
  },

  indexesFromIndexCell: [],

  searchField: {
    "Gov-ua": createSearchState(),
    Lotus: createSearchState(),
    phones: createSearchState(),

    // Загальний search state для всіх Dictionary modes
    dictionary: createSearchState(),
  },
};

export const toggledElemetsReducer = (state = initialState, action) => {
  switch (action.type) {
    // =====================================================
    // INDEXES FROM INDEX CELL
    // =====================================================

    case ADD_INDEXES_FROM_INDEXCELL:
      console.log("Додаю індекси:", action.indexes);

      return {
        ...state,
        indexesFromIndexCell: action.indexes,
      };

    // =====================================================
    // FILTER PANEL
    // =====================================================

    case TOGGLE_FIELTER_PANEL_ELEMENT:
      return {
        ...state,

        showFilterPanel: {
          ...state.showFilterPanel,

          isActive:
            action.value !== undefined
              ? action.value
              : !state.showFilterPanel.isActive,
        },
      };

    // =====================================================
    // SEARCH FIELD
    // =====================================================

    case TOGGLE_SEARCH_FIELD_ELEMENT:
      return {
        ...state,

        showSearchField: {
          ...state.showSearchField,

          isActive:
            action.value !== undefined
              ? action.value
              : !state.showSearchField.isActive,
        },
      };

    // =====================================================
    // PAGE NAVBAR LINK
    // =====================================================

    case TOGGLE_PAGES_NAVBAR_LINK:
      return {
        ...state,

        pagesNavbarLinkElementOnCurrentPage: {
          ...state.pagesNavbarLinkElementOnCurrentPage,

          isPressed: action.value,
        },
      };

    // =====================================================
    // UPDATE SEARCH DRAFT
    // =====================================================

    case UPDATE_DRAFT_VALUE:
      return {
        ...state,

        searchField: {
          ...state.searchField,

          [action.activeMenu]: {
            ...(state.searchField[action.activeMenu] ||
              createSearchState()),

            draftValue: action.draftValue,
          },
        },
      };

    // =====================================================
    // ADD FOUND ITEMS
    // =====================================================

    case ADD_FOUND_ITEMS:
      return {
        ...state,

        searchField: {
          ...state.searchField,

          [action.activeMenu]: {
            ...(state.searchField[action.activeMenu] ||
              createSearchState()),

            searchValue: action.searchValue || "",

            draftValue: action.searchValue || "",

            foundResults: action.foundResults || [],

            userSearchedOnce: true,

            lastSearchFound:
              action.foundResults?.length > 0,
          },
        },
      };

    // =====================================================
    // CLEAR CURRENT SEARCH FORM
    // =====================================================

    case CLEAR_SEARCH_FORM:
      return {
        ...state,

        searchField: {
          ...state.searchField,

          [action.activeMenu]: createSearchState(),
        },
      };

    // =====================================================
    // CLEAR ALL SEARCH STATES
    // =====================================================

    case CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS:
      return {
        ...state,

        searchField: {
          "Gov-ua": createSearchState(),

          Lotus: createSearchState(),

          phones: createSearchState(),

          dictionary: createSearchState(),
        },
      };

    // =====================================================
    // DEFAULT
    // =====================================================

    default:
      return state;
  }
};


// =========================================================
// ACTION CREATORS
// =========================================================

export const toggleFielterPanelElement = (value) => ({
  type: TOGGLE_FIELTER_PANEL_ELEMENT,
  value,
});

export const toggleSearchFieldActionCreator = (value) => ({
  type: TOGGLE_SEARCH_FIELD_ELEMENT,
  value,
});

export const togglepagesNavbarLinkElementOnCurrentPage = (value) => ({
  type: TOGGLE_PAGES_NAVBAR_LINK,
  value,
});

export const updateDraftValue = (activeMenu, draftValue) => ({
  type: UPDATE_DRAFT_VALUE,
  activeMenu,
  draftValue,
});

export const addFoundItems = (
  activeMenu,
  searchValue,
  foundResults
) => ({
  type: ADD_FOUND_ITEMS,
  activeMenu,
  searchValue,
  foundResults,
});

export const clearSearchForm = (activeMenu) => ({
  type: CLEAR_SEARCH_FORM,
  activeMenu,
});

export const clearSearchFieldsAndFoundResults = () => ({
  type: CLEAR_SEARCH_FIELDS_AND_FOUND_RESULTS,
});

export const addIndexesFromIndexCell = (indexes) => ({
  type: ADD_INDEXES_FROM_INDEXCELL,
  indexes,
});