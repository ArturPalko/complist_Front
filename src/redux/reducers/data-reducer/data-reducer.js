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
// debugger
      return {
        ...state,
        [key]: paginateData(data, key, rowsPerPage),
      };
    }

    // =========================
    // DICTIONARIES
    // =========================
    // case SET_DICTIONARIES: {
    //   const { positions, userTypes } = action.payload;

    //   return {
    //     ...state,
    //     dictionaries: {
    //       ...state.dictionaries,
    //       positions,
    //       userTypes,
    //     },
    //   };
    // }

case SET_DICTIONARIES: {
  const { positions, userTypes } = action.payload;
// debugger
  return {
    ...state,
    dictionaries: {
      ...state.dictionaries,
      positions: paginateData(positions, "positions", rowsPerPage),
      userTypes: paginateData(userTypes, "userTypes", rowsPerPage),
    },
  };
}

    // =========================
    // REORDER / SET PAGES
    // =========================
//    case SET_ORDER: {
//   const { key, pages, deptId, currentMode } = action.payload;

//   if (key === "phones") {
//     return {
//       ...state,
//       phones: applyPhonesReorder(state, pages, deptId, currentMode),
//     };
//   }

//   const newPages = chunkIntoPages(pages, rowsPerPage);
//   debugger

//   if (currentMode === "positions") {
//     return {
//       ...state,
//       dictionaries: {
//         ...state.dictionaries,
//         positions: newPages,
//       },
//     };
//   }

//   return {
//     ...state,
//     [key]: newPages,
//   };
// }
case SET_ORDER: {
  const { key, pages, depId, currentMode } = action.payload;

  const { reordered, payload } = pages;

  let newState = {
    ...state,
  };

  // 📱 PHONES — тільки payload (індекси)
  if (key === "phones") {
    newState.phones = applyPhonesReorder(
      state,
      payload,
      depId,
      currentMode
    );
  } else {
    // 📦 інші кейси — повертаємо в paginated формат
    const newPages = chunkIntoPages(reordered, rowsPerPage);

    newState[key] = newPages;
  }

  // 📚 dictionaries синхронізуються з mode
  if (currentMode) {
    const newPages = chunkIntoPages(reordered, rowsPerPage);

    newState.dictionaries = {
      ...state.dictionaries,
      [currentMode]: newPages,
    };
  }

  return newState;
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

