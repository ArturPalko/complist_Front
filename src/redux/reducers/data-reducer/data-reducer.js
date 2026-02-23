import { fetchDataThunk } from "../../../dal/thunks.js";
import { rowsPerPage as limitRows } from "../../../configs/app/constants.js";
import { paginateData } from "./data-reducerFunctions/pagination.js";


// Action type
const ADD_DATA = "ADD_DATA";

const initialState = {
  "Gov-ua": [],
  Lotus: [],
  phones: []
};

// Reducer
export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DATA: {
      const { key, data } = action.payload;
      return {
        ...state,
        [key]: paginateData(data, key, limitRows)
      };
    }
    default:
      return state;
  }
};

// Action creator
export const addDataActionCreator = (key, data) => ({
  type: ADD_DATA,
  payload: { key, data }
});

export const getDataByMenu = (key) => fetchDataThunk(addDataActionCreator, key);
