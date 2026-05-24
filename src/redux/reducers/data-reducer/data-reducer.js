import { fetchDataThunk } from "../../../dal/thunks/dataThunks.js";
import { rowsPerPage as limitRows } from "../../../configs/app/constants.js";
import { paginateData } from "./data-reducerFunctions/pagination.js";
import { applyPhonesReorder } from "./data-reducerFunctions/applyPhonesReorder.js";
import { chunkIntoPages } from "../../providers/DragProvider/dragProvider-helpers/commonFunctions.js";
import { rowsPerPage } from "../../../configs/app/constants.js";

// Action type
const ADD_DATA = "ADD_DATA";
const SET_ORDER = "SET_ORDER"

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

   ;

case SET_ORDER: {
  const { key, pages, deptId } = action.payload;

  // 🔥 phones — складна логіка
  if (key === "phones") {
    return {
      ...state,
      phones: applyPhonesReorder(state, pages,deptId),
    };
  }

  // 🔥 non-phones — використовуємо загальний chunker


  const newPages = chunkIntoPages(pages,rowsPerPage);

  return {
    ...state,
    [key]: newPages,
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

export const setPagesActionCreator = (key, pages,deptId) => ({
  type: SET_ORDER,
  payload: { key, pages, deptId },
});



export const getDataByMenu = (key) => fetchDataThunk(addDataActionCreator, key);


