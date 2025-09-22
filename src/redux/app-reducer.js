
const SET_DATA_IS_LOADED = "SET_DATA_IS_LOADED";

const initialState = {
 ["gov-ua"]:{dataIsLoaded: false},
 lotus:{dataIsLoaded: false} ,
 phones:{dataIsLoaded:false}
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA_IS_LOADED:
      return { ...state, [action.page]:{dataIsLoaded: action.value }}
    default:
      return state;
  }
};

export const setDataIsLoadedActionCreator = (value,page) => ({
  type: SET_DATA_IS_LOADED,
  value,
  page
});
