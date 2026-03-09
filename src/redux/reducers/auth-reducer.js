const TOGGLE_LOGGED = "TOGGLE_LOGGED";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";

const initialState = {
  isLoggedIn: false,
  userName: "",
  message: ""
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    
      return {
        ...state,
        isLoggedIn: true,
        userName: action.userName,
        message: action.message
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        userName: "",
        message: action.payload
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userName: "",
        message: ""
      };

    default:
      return state;
  }
};

// Action creators
export const loginSuccess = (responseData) => ({
  type: LOGIN_SUCCESS,
  success: responseData.success,
  message: responseData.message,   // зверни увагу на typo: message, а не meessage
  userName: responseData.userName
});
export const loginFailure = (message) => ({ type: LOGIN_FAILURE, payload: message });
export const logout = () => ({ type: LOGOUT });