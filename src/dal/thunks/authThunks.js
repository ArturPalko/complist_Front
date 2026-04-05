import { loginSuccess, loginFailure, logout } from "../../redux/reducers/auth-reducer";
import {loginUrl, logoutUrl} from "../urls";
import { apiPrivate } from "../api";

export const loginUser = (data) => async (dispatch) => {
  try {
    const response = await apiPrivate.post(loginUrl, data);
    dispatch(loginSuccess(response.data));

  } catch (err) {
    const message = err.response?.data || "Login failed";
    dispatch(loginFailure(message));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const response = await apiPrivate.post(logoutUrl);
    dispatch(logout());
  
  } catch (err) {
    const message = err.response?.data?.message || "Logout failed";
    alert(message);
  
  }
};

export const checkAuth = () => async (dispatch) => {
  try {
    const res = await apiPrivate.get("/checkAuth");

    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure(null));
  }
};