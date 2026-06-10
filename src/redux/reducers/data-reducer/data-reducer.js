import { fetchDataThunk } from "../../../dal/thunks/dataThunks.js";
import { paginateData } from "./data-reducerFunctions/pagination.js";
import { applyPhonesReorder } from "./data-reducerFunctions/applyPhonesReorder.js";
import { chunkIntoPages } from "../../providers/DragProvider/dragProvider-helpers/commonFunctions.js";
import { rowsPerPage } from "../../../configs/app/constants.js";

// Action types
const ADD_DATA = "ADD_DATA";
const SET_ORDER = "SET_ORDER";
const SET_DICTIONARIES = "SET_DICTIONARIES";

const initialState = {
  "Gov-ua": [],
  Lotus: [],
  phones: [],

  dictionaries: {
    positions: [],
    userTypes: [],
  },
};

// Reducer
export const dataReducer = (state = initialState, action) => {
  switch (action.type) {

    // =========================
    // LOAD DATA
    // =========================
    case ADD_DATA: {
      const { key, data } = action.payload;

      return {
        ...state,
        [key]: paginateData(data, key, rowsPerPage),
      };
    }

    // =========================
    // DICTIONARIES
    // =========================
    case SET_DICTIONARIES: {
      const { positions, userTypes } = action.payload;

      return {
        ...state,
        dictionaries: {
          ...state.dictionaries,
          positions,
          userTypes,
        },
      };
    }

    // =========================
    // REORDER / SET PAGES
    // =========================
    case SET_ORDER: {
      const { key, pages, deptId, currentMode } = action.payload;

      if (key === "phones") {
        return {
          ...state,
          phones: applyPhonesReorder(state, pages, deptId, currentMode),
        };
      }

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
  payload: { key, data },
});

export const setPagesActionCreator = (
  key,
  pages,
  deptId,
  currentMode
) => ({
  type: SET_ORDER,
  payload: { key, pages, deptId, currentMode },
});

export const setDictionaries = (payload) => ({
  type: SET_DICTIONARIES,
  payload,
});

// =========================
// THUNK
// =========================

export const getDataByMenu = (key) =>
  fetchDataThunk(addDataActionCreator, key);