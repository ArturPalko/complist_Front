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
    departments:[]
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
// //debugger
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
  const { positions, userTypes, departments } = action.payload;
// //debugger
  return {
    ...state,
    dictionaries: {
      ...state.dictionaries,
      positions: paginateData(positions, "positions", rowsPerPage),
      userTypes: paginateData(userTypes, "userTypes", rowsPerPage),
      departments:paginateData(departments, "departments", rowsPerPage)
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
//   //debugger

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
debugger
  console.log("===== SET_ORDER START =====");
  console.log("key:", key);
  console.log("currentMode:", currentMode);
  console.log("depId:", depId);

  console.log("reordered type:", Array.isArray(reordered));
  console.log("reordered length:", reordered?.length);
  console.log("reordered sample:", reordered?.[0]);
debugger
  let newState = { ...state };

  // 📦 departments case
  if (currentMode === "department") {
    const newDepartments = chunkIntoPages(reordered, rowsPerPage);
    debugger

    console.log("=== DEPARTMENTS CASE ===");
    console.log("old reference:", state.dictionaries.departments);
    console.log("new reference:", newDepartments);
    console.log(
      "same reference?",
      state.dictionaries.departments === newDepartments
    );
debugger
    return {
      ...state,
      dictionaries: {
        ...state.dictionaries,
        departments: newDepartments,
      },
    };
  }

  // 📚 sections case
  if (currentMode === "section") {
    console.log("=== SECTIONS CASE ===");
    console.log("departments pages count:", state.dictionaries.departments?.length);
    debugger

    const deptId = reordered?.[0]?.departmentId;

    console.log("target deptId:", deptId);
debugger
    newState.dictionaries = {
      ...state.dictionaries,
      departments: state.dictionaries.departments.map(page => ({
        ...page,
        rows: page.rows.map(dep => {
          if (dep.departmentId === deptId) {
            debugger
            console.log("MATCH FOUND dept:", dep.id);
            return {
              ...dep,
              sections: reordered,
            };
          }
          debugger
          return dep;
        }),
      })),
    };

    console.log("sections update done");
  }

  console.log("===== SET_ORDER END =====");
debugger

  if(currentMode == "position"){
    const newPositions = chunkIntoPages(reordered, 18);
    debugger
    newState.dictionaries = {
      ...state.dictionaries,
      positions : newPositions
    }
  }

   if(currentMode == "userType"){
    const newPositions = chunkIntoPages(reordered, 18);
    debugger
    newState.dictionaries = {
      ...state.dictionaries,
      userTypes : newPositions
    }
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

