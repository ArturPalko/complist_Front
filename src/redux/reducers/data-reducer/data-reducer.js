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
debugger
  if (key !== "phones") {
    return {
      ...state,
      [key]: pages,
    };
  }

  const priorityMap = new Map(
    pages.map((p) => [p.id, p.priority])
  );

  // 🔥 1. FLATTEN ВСІ СТОРІНКИ В ОДИН СПИСОК
  const allRows = state[key].flatMap((p) => p.rows ?? []);

  // 🔥 2. ГРУПУВАННЯ
  const groups = [];
  let currentGroup = null;

  for (const row of allRows) {
    if (row.type === "department") {
      if (currentGroup) groups.push(currentGroup);

      currentGroup = {
        department: row,
        items: [],
      };
      continue;
    }

    if (currentGroup) {
      currentGroup.items.push(row);
    }
  }

  if (currentGroup) groups.push(currentGroup);

  // 🔥 3. UPDATE PRIORITY
  const updatedGroups = groups.map((g) => {
    const depId = g.department.departmentId;

    const newPriority = priorityMap.get(depId);

    return {
      ...g,
      department: {
        ...g.department,
        departmentPriority:
          newPriority ?? g.department.departmentPriority,
      },
    };
  });

  // 🔥 4. SORT GROUPS
  updatedGroups.sort((a, b) => {
    return (
      (a.department.departmentPriority ?? 9999) -
      (b.department.departmentPriority ?? 9999)
    );
  });

  // 🔥 5. FLATTEN BACK
  const flat = [];

  for (const g of updatedGroups) {
    flat.push(g.department);
    flat.push(...g.items);
  }

  // 🔥 6. РОЗБИВАЄМО НАЗАД У PAGES
  const pageSize = state[key][0]?.rows?.length ?? 20;

  const newPages = [];

  for (let i = 0; i < flat.length; i += pageSize) {
    newPages.push({
      ...state[key][Math.floor(i / pageSize)] ?? {},
      rows: flat.slice(i, i + pageSize),
    });
  }

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

export const setPagesActionCreator = (key, pages) => ({
  type: SET_PAGES,
  payload: { key, pages },
});



export const getDataByMenu = (key) => fetchDataThunk(addDataActionCreator, key);


