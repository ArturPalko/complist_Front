import { createFetchThunk } from "./fetchDataThunkCreator";
import { rowsPerPage as limitRows } from "./selectors/selector";
import { paginateData } from "../redux/reducersHelpunctions/pagination.js";

// Action type
const ADD_DATA = "ADD_DATA";

// Fetch URLs
const fetchUrls = {
  "Gov-ua": "http://localhost:5114/mails/Gov-ua",
  Lotus: "http://localhost:5114/mails/Lotus",
  phones: "http://localhost:5114/phones"
};

// Initial state
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

// Universal thunk
export const getDataByMenu = (key) => {
  const fetchUrl = fetchUrls[key];
  if (!fetchUrl) throw new Error(`No fetch URL defined for menuKey "${key}"`);
  return createFetchThunk(fetchUrl, addDataActionCreator, key);
};

// // Selectors
// export const getDataForMenu = (state, menuKey) => state.data?.[menuKey] ?? [];
// export const getGovUaMails = (state) => getDataForMenu(state, "Gov-ua");
// export const getLotusMails = (state) => getDataForMenu(state, "Lotus");
// export const getPhones = (state) => getDataForMenu(state, "phones");
