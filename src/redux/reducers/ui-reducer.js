// Action Types
export const OPEN_LOGIN = "ui/OPEN_LOGIN";
export const CLOSE_LOGIN = "ui/CLOSE_LOGIN";
export const TOGGLE_LOGIN = "ui/TOGGLE_LOGIN";

// Action Creators
export const openLogin = () => ({ type: OPEN_LOGIN });
export const closeLogin = () => ({ type: CLOSE_LOGIN });
export const toggleLogin = () => ({ type: TOGGLE_LOGIN });

// Initial State
const initialState = {
  isLoginOpen: false
};

// Reducer
export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_LOGIN:
      return {
        ...state,
        isLoginOpen: true
      };
    case CLOSE_LOGIN:
      return {
        ...state,
        isLoginOpen: false
      };
    case TOGGLE_LOGIN:
      return {
        ...state,
        isLoginOpen: !state.isLoginOpen
      };
    default:
      return state;
  }
}