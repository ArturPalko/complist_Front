/* =========================
   ACTION TYPES
========================= */
const SET_VIEW_MODE = "SET_VIEW_MODE";
const TOGGLE_VIEW_MODE = "TOGGLE_VIEW_MODE";
const RESET_PHONES_UI = "RESET_PHONES_UI";
const SET_ACTIVE_DEPARTMENT = "SET_ACTIVE_DEPARTMENT";

const SET_UNSAVED_ORDER = "SET_UNSAVED_ORDER";
const CLEAR_UNSAVED_ORDER = "CLEAR_UNSAVED_ORDER";
const TOGGLE_ADD_USERS_MODE = "TOGGLE_ADD_USERS_MODE";






const initialState = {
  viewMode: null, // "departments" | "sections"
   addUsersMode: false,
  activeDepartmentId: null,

  // 🔥 snapshot останнього reorder перед save
  unsavedOrder: null,
};


/* =========================
   REDUCER
========================= */
export const uiReducer = (state = initialState, action) => {
  switch (action.type) {

    case TOGGLE_ADD_USERS_MODE:
      // debugger
      return {
        ...state,
        addUsersMode: !state.addUsersMode
      };


    /* =========================
       ACTIVE DEPARTMENT
    ========================= */
    case SET_ACTIVE_DEPARTMENT:
      return {
        ...state,
        activeDepartmentId: action.id,
      };

    /* =========================
       VIEW MODE
    ========================= */
    case SET_VIEW_MODE:
      return {
        ...initialState,
        viewMode: action.mode === state.viewMode ? null : action.mode,
      };

    case TOGGLE_VIEW_MODE:
      return {
        ...state,
        viewMode:
          state.viewMode === "sections"
            ? "departments"
            : "sections",
      };

    /* =========================
       UNSAVED ORDER (🔥 NEW)
    ========================= */
    case SET_UNSAVED_ORDER:
      return {
        ...state,
        unsavedOrder: action.payload,
      };

    case CLEAR_UNSAVED_ORDER:
      return {
        ...state,
        unsavedOrder: null,
      };

    /* =========================
       RESET UI
    ========================= */
    case RESET_PHONES_UI:
      return initialState;

    default:
      return state;
  }
};

/* =========================
   ACTION CREATORS
========================= */

export const toggleaddUsersMode = () => ({
  type: TOGGLE_ADD_USERS_MODE,
});
export const setPhonesViewMode = (mode) => ({
  type: SET_VIEW_MODE,
  mode,
});

export const togglePhonesViewMode = () => ({
  type: TOGGLE_VIEW_MODE,
});

export const resetPhonesUi = () => ({
  type: RESET_PHONES_UI,
});

export const setActiveDepartment = (id) => ({
  type: SET_ACTIVE_DEPARTMENT,
  id,
});

/* =========================
   UNSAVED ORDER ACTIONS
========================= */
export const setUnsavedOrder = (payload) => ({
  type: SET_UNSAVED_ORDER,
  payload,
});

export const clearUnsavedOrder = () => ({
  type: CLEAR_UNSAVED_ORDER,
});