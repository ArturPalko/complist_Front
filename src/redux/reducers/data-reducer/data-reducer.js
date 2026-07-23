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
    departments:[],
    phones:{
      landline:[],
      internal:[],
      cisco:[]
    }
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
// //
      return {
        ...state,
        [key]: paginateData(data, key, rowsPerPage),
      };
    }

case SET_DICTIONARIES: {
  const { positions, userTypes, departments, phones,users,sections, deps } = action.payload;
     

  return {
    ...state,
    dictionaries: {
      ...state.dictionaries,

      positions: paginateData(positions, "positions", rowsPerPage),
      userTypes: paginateData(userTypes, "userTypes", rowsPerPage),
      departments: paginateData(departments, "departments", rowsPerPage),
      users: users,
      sections :sections,
      deps:deps,


      phones: {
        landline: paginateData(phones[0].phones || [], "landline", rowsPerPage),
        internal: paginateData(phones[1].phones || [], "internal", rowsPerPage),
        cisco: paginateData(phones[2].phones || [], "cisco", rowsPerPage),
      }
    },
  };
}


case SET_ORDER: {
  const { key, pages, depId, currentMode } = action.payload;
  const { reordered, payload } = pages;

  let newState = { ...state };

  // 📦 departments
  if (currentMode === "department") {
    const newDepartments = chunkIntoPages(reordered, rowsPerPage);

    return {
      ...state,
      dictionaries: {
        ...state.dictionaries,
        departments: newDepartments,
      },
    };
  }

  // 📚 sections
  if (currentMode === "section") {
    const deptId = reordered?.[0]?.departmentId;

    newState.dictionaries = {
      ...state.dictionaries,
      departments: state.dictionaries.departments.map(page => ({
        ...page,
        rows: page.rows.map(dep =>
          dep.departmentId === deptId
            ? {
                ...dep,
                sections: reordered,
              }
            : dep
        ),
      })),
    };

    return newState;
  }

  // 📌 positions
  if (currentMode === "position") {
    return {
      ...state,
      dictionaries: {
        ...state.dictionaries,
        positions: chunkIntoPages(reordered, 18),
      },
    };
  }

  // 👤 user types
  if (currentMode === "userType") {
    return {
      ...state,
      dictionaries: {
        ...state.dictionaries,
        userTypes: chunkIntoPages(reordered, 18),
      },
    };
  }

  // 🔥 everything else — simple pagination
  return {
    ...state,
    [key]: chunkIntoPages(reordered, rowsPerPage),
  };
}

default:
  return state;
}}

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

