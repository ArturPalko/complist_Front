const SET_DATA_IS_LOADED = "SET_DATA_IS_LOADED";
const TOGGLE_DATA_IS_FETCHING = "TOGGLE_DATA_IS_FETCHING";

const initialState = {
  "Gov-ua": { dataIsLoaded: false, dataIsFetching: false },
  Lotus: { dataIsLoaded: false, dataIsFetching: false },
  phones: { dataIsLoaded: false, dataIsFetching: false }
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA_IS_LOADED:
      return {
        ...state,
        [action.page]: {
          ...state[action.page],
          dataIsLoaded: action.value
        }
      };

    case TOGGLE_DATA_IS_FETCHING: 
      return {
        ...state,
        [action.page]: {
          ...state[action.page],
          dataIsFetching: action.value
        }
      };

    default:
      return state;
  }
};

export const setDataIsLoadedActionCreator = (value, page) => ({
  type: SET_DATA_IS_LOADED,
  value,
  page
});

export const toggleDataIsFetchingActionCreator = (value, page) => ({
  type: TOGGLE_DATA_IS_FETCHING,
  value,
  page
});
