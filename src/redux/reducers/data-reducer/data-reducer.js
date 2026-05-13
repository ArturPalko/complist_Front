import { fetchDataThunk } from "../../../dal/thunks/dataThunks.js";
import { rowsPerPage as limitRows } from "../../../configs/app/constants.js";
import { paginateData } from "./data-reducerFunctions/pagination.js";


// Action type
const ADD_DATA = "ADD_DATA";
const SET_PAGES = "SET_PAGES"

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

case SET_PAGES: {
  const { key, pages } = action.payload;

  if (key !== "phones") {
    return {
      ...state,
      [key]: pages,
    };
  }

  // pages тут = payload (!!!)
  const priorityMap = new Map(
    pages.map((el) => [
      el.departmentId,
      el.departmentPriority,
    ])
  );

  const currentPages = state[key];

  const updatedPages = currentPages.map((p) => ({
    ...p,
    rows: (p.rows ?? []).map((row) => {
      // if (row.type !== "department") return row;

      const newPriority = priorityMap.get(row.departmentId);

      if (newPriority == null) return row;

      return {
        ...row,
        departmentPriority: newPriority,
      };
    }),
  }));

  return {
    ...state,
    [key]: updatedPages,
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

export const setPagesActionCreator = (key, pages) => ({
  type: SET_PAGES,
  payload: { key, pages },
});




export const getDataByMenu = (key) => fetchDataThunk(addDataActionCreator, key);
