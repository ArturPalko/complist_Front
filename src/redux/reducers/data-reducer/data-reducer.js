import { fetchDataThunk } from "../../../dal/thunks/dataThunks.js";

import { paginateData } from "./data-reducerFunctions/pagination.js";
import { sortData } from "./data-reducerFunctions/sorting.js";

import {
  chunkIntoPages,
} from "../../providers/DragProvider/dragProvider-helpers/commonFunctions.js";

import { rowsPerPage } from "../../../configs/app/constants.js";

// =====================================================
// ACTION TYPES
// =====================================================

const ADD_DATA = "ADD_DATA";
const SET_ORDER = "SET_ORDER";
const SET_DICTIONARIES = "SET_DICTIONARIES";
const RESET_DICTIONARIES = "RESET_DICTIONARIES";
const SORT_USERS = "SORT_USERS";
const SORT_PHONES = "SORT_PHONES";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  "Gov-ua": [],
  Lotus: [],
  phones: [],

  dictionaries: {
    positions: [],
    userTypes: [],
    departments: [],
    users: [],
    sections: [],
    deps: [],

    phones: {
      landline: [],
      internal: [],
      cisco: [],
    },
  },
};

// =====================================================
// REDUCER
// =====================================================

export const dataReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {

    // ===================================================
    // LOAD DATA
    // ===================================================

    case ADD_DATA: {
      const {
        key,
        data,
      } = action.payload;

      return {
        ...state,

        [key]: paginateData(
          data,
          key,
          rowsPerPage
        ),
      };
    }

    // ===================================================
    // SET DICTIONARIES
    // ===================================================

    case SET_DICTIONARIES: {
      const {
        positions,
        userTypes,
        departments,
        phones,
        users,
        sections,
        deps,
      } = action.payload;

      return {
        ...state,

        dictionaries: {
          ...state.dictionaries,

          positions: paginateData(
            positions,
            "positions",
            rowsPerPage
          ),

          userTypes: paginateData(
            userTypes,
            "userTypes",
            rowsPerPage
          ),

          departments: paginateData(
            departments,
            "departments",
            rowsPerPage
          ),

          users: paginateData(
            users,
            "users",
            rowsPerPage - 3
          ),

          sections,

          deps,

          phones: {
            landline: paginateData(
              phones[0].phones || [],
              "landline",
              rowsPerPage
            ),

            internal: paginateData(
              phones[1].phones || [],
              "internal",
              rowsPerPage
            ),

            cisco: paginateData(
              phones[2].phones || [],
              "cisco",
              rowsPerPage
            ),
          },
        },
      };
    }

    // ===================================================
    // SORT USERS
    // ===================================================

    case SORT_USERS: {
      const {
        key,
        direction,
      } = action.payload;

      // Беремо users з усіх сторінок
      const allUsers =
        state.dictionaries.users.flatMap(
          (page) => page.rows || []
        );

      // Сортуємо
      const sortedUsers =
        sortData(
          allUsers,
          key,
          direction
        );

      // Знову розбиваємо на сторінки
      const sortedPages =
        chunkIntoPages(
          sortedUsers,
          rowsPerPage - 3
        );

      return {
        ...state,

        dictionaries: {
          ...state.dictionaries,

          users: sortedPages,
        },
      };
    }

    // ===================================================
    // SORT PHONES
    // ===================================================

    case SORT_PHONES: {
      const {
        phoneType,
        key,
        direction,
      } = action.payload;

      // Беремо телефони з усіх сторінок
      const allPhones =
        state.dictionaries.phones[
          phoneType
        ].flatMap(
          (page) => page.rows || []
        );

      // Сортуємо
      const sortedPhones =
        sortData(
          allPhones,
          key,
          direction
        );

      // Знову розбиваємо на сторінки
      const sortedPages =
        chunkIntoPages(
          sortedPhones,
          rowsPerPage
        );

      return {
        ...state,

        dictionaries: {
          ...state.dictionaries,

          phones: {
            ...state.dictionaries.phones,

            [phoneType]: sortedPages,
          },
        },
      };
    }

    // ===================================================
    // RESET
    // ===================================================

    case RESET_DICTIONARIES:
      return {
        ...state,

        dictionaries:
          initialState.dictionaries,
      };

    // ===================================================
    // SET ORDER
    // ===================================================

    case SET_ORDER: {
      const {
        key,
        pages,
        depId,
        currentMode,
      } = action.payload;

      const {
        reordered,
        payload,
      } = pages;

      let newState = {
        ...state,
      };

      // -------------------------------------------------
      // DEPARTMENTS
      // -------------------------------------------------

      if (
        currentMode === "departments"
      ) {
        const newDepartments =
          chunkIntoPages(
            reordered,
            rowsPerPage
          );

        return {
          ...state,

          dictionaries: {
            ...state.dictionaries,

            departments:
              newDepartments,
          },
        };
      }

      // -------------------------------------------------
      // SECTIONS
      // -------------------------------------------------

      if (
        currentMode === "sections"
      ) {
        const deptId =
          reordered?.[0]?.departmentId;

        newState.dictionaries = {
          ...state.dictionaries,

          departments:
            state.dictionaries.departments.map(
              (page) => ({
                ...page,

                rows: page.rows.map(
                  (dep) =>
                    dep.departmentId ===
                    deptId
                      ? {
                          ...dep,

                          sections:
                            reordered,
                        }
                      : dep
                ),
              })
            ),
        };

        return newState;
      }

      // -------------------------------------------------
      // POSITIONS
      // -------------------------------------------------

      if (
        currentMode === "positions"
      ) {
        return {
          ...state,

          dictionaries: {
            ...state.dictionaries,

            positions:
              chunkIntoPages(
                reordered,
                rowsPerPage
              ),
          },
        };
      }

      // -------------------------------------------------
      // USER TYPES
      // -------------------------------------------------

      if (
        currentMode === "userTypes"
      ) {
        return {
          ...state,

          dictionaries: {
            ...state.dictionaries,

            userTypes:
              chunkIntoPages(
                reordered,
                rowsPerPage
              ),
          },
        };
      }

      // -------------------------------------------------
      // EVERYTHING ELSE
      // -------------------------------------------------

      return {
        ...state,

        [key]: chunkIntoPages(
          reordered,
          rowsPerPage
        ),
      };
    }

    // ===================================================
    // DEFAULT
    // ===================================================

    default:
      return state;
  }
};

// =====================================================
// ACTION CREATORS
// =====================================================

// -----------------------------------------------------
// ADD DATA
// -----------------------------------------------------

export const addDataActionCreator = (
  key,
  data
) => ({
  type: ADD_DATA,

  payload: {
    key,
    data,
  },
});

// -----------------------------------------------------
// SET PAGES / ORDER
// -----------------------------------------------------

export const setPagesActionCreator = (
  key,
  pages,
  deptId,
  currentMode
) => ({
  type: SET_ORDER,

  payload: {
    key,
    pages,
    deptId,
    currentMode,
  },
});

// -----------------------------------------------------
// SORT USERS
// -----------------------------------------------------

export const sortUsersActionCreator = (
  key,
  direction
) => ({
  type: SORT_USERS,

  payload: {
    key,
    direction,
  },
});

// -----------------------------------------------------
// SORT PHONES
// -----------------------------------------------------

export const sortPhonesActionCreator = (
  phoneType,
  key,
  direction
) => ({
  type: SORT_PHONES,

  payload: {
    phoneType,
    key,
    direction,
  },
});

// -----------------------------------------------------
// SET DICTIONARIES
// -----------------------------------------------------

export const setDictionaries = (
  payload
) => ({
  type: SET_DICTIONARIES,
  payload,
});

// -----------------------------------------------------
// RESET DICTIONARIES
// -----------------------------------------------------

export const resetDictionaries = () => ({
  type: RESET_DICTIONARIES,
});

// =====================================================
// THUNK
// =====================================================

export const getDataByMenu = (
  key
) =>
  fetchDataThunk(
    addDataActionCreator,
    key
  );