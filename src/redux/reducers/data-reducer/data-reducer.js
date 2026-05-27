import { fetchDataThunk } from "../../../dal/thunks/dataThunks.js";
import { paginateData } from "./data-reducerFunctions/pagination.js";
import { applyPhonesReorder } from "./data-reducerFunctions/applyPhonesReorder.js";
import { chunkIntoPages } from "../../providers/DragProvider/dragProvider-helpers/commonFunctions.js";
import { rowsPerPage } from "../../../configs/app/constants.js";

// Action type
const ADD_DATA = "ADD_DATA";
const SET_ORDER = "SET_ORDER";

const initialState = {
  "Gov-ua": [],
  Lotus: [],

  phones: [],

  // NEW DICTIONARIES

};

// Reducer
export const dataReducer = (state = initialState, action) => {
  switch (action.type) {

    // =========================
    // LOAD DATA
    // =========================
    case ADD_DATA: {
      const { key, data } = action.payload;
      debugger

      return {
        ...state,

        [key]:
          key === "userTypes" || key === "positions"
            ? data
            : paginateData(data, key, rowsPerPage)
      };
    }

    // =========================
    // REORDER / SET PAGES
    // =========================
    case SET_ORDER: {
      const { key, pages, deptId, currentMode } = action.payload;

      // 🔥 phones — complex reorder logic
      if (key === "phones") {
        return {
          ...state,
          phones: applyPhonesReorder(state, pages, deptId, currentMode),
        };
      }

      // 🔥 everything else — simple pagination
      const newPages = chunkIntoPages(pages, rowsPerPage);

      return {
        ...state,
        [key]: newPages,
      };
    }

    default:
      return state;
  }
};

// =========================
// ACTION CREATORS
// =========================

export const addDataActionCreator = (key, data) => ({
  type: ADD_DATA,
  payload: { key, data }
});

export const setPagesActionCreator = (key, pages, deptId, currentMode) => ({
  type: SET_ORDER,
  payload: { key, pages, deptId, currentMode },
});

// =========================
// THUNK
// =========================

export const getDataByMenu = (key) =>
  fetchDataThunk(addDataActionCreator, key);