import { createFetchThunk } from "./fetchDataThunkCreator";
import { rowsPerPage as limitRows } from "./selectors/selector";
import { paginateData } from "../redux/reducersHelpunctions/pagination.js"; // імпортуємо універсальну функцію

const ADD_PHONES = "ADD_PHONES";
const fetchUrl = "http://localhost:5114/phones";

const initialState = { pages: [] };

// ====================== reducer ======================
export const phonesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PHONES: {
      // використовуємо paginateData, передаємо "phones" як menuKey
      const pages = paginateData(action.data, "phones", limitRows);
      return { ...state, pages };
    }
    default:
      return state;
  }
};

// ====================== action creator ======================
export const addPhonesActionCreator = (data) => ({
  type: ADD_PHONES,
  data
});

// ====================== thunk ======================
export const getPhonesData = () =>
  createFetchThunk(fetchUrl, addPhonesActionCreator, "phones");
