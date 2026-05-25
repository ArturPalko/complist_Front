const initialState = {
  viewMode: null, // "departments" | "sections"
  activeDepartmentId: null
};

/* =========================
   ACTION TYPES
========================= */
const SET_VIEW_MODE = "SET_VIEW_MODE";
const TOGGLE_VIEW_MODE = "TOGGLE_VIEW_MODE";
const RESET_PHONES_UI = "RESET_PHONES_UI";
const SET_ACTIVE_DEPARTMENT = "SET_ACTIVE_DEPARTMENT";

/* =========================
   REDUCER
========================= */
export const uiReducer = (state = initialState, action) => {
  switch (action.type) {

     case SET_ACTIVE_DEPARTMENT:
      return {
        ...state,
        activeDepartmentId: action.id
      };

      
    /* 🔘 set explicit mode */
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.mode == state.viewMode ? null: action.mode,
        activeDepartmentId: action.mode == "sections" ? null : state.activeDepartmentId
      };

    /* 🔁 toggle between departments <-> sections */
    case TOGGLE_VIEW_MODE:
        
      return {
        ...state,
        viewMode:
          state.viewMode === "sections"
            ? "departments"
            : "sections"
      };

    /* 🔄 reset UI state */
    case RESET_PHONES_UI:
      return initialState;

    default:
      return state;
  }
};

/* =========================
   ACTION CREATORS
========================= */
export const setPhonesViewMode = (mode) => ({
  type: SET_VIEW_MODE,
  mode
});

export const togglePhonesViewMode = () => ({
  type: TOGGLE_VIEW_MODE
});

export const resetPhonesUi = () => ({
  type: RESET_PHONES_UI
});

export const setActiveDepartment = (id) => ({
  type: SET_ACTIVE_DEPARTMENT,
  id
});

