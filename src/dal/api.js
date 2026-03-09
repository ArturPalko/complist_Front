import axios from "axios";
import axiosRetry from "axios-retry";
import { passwordUrls, loginUrl, logoutUrl} from "./urls";
import { loginSuccess, loginFailure, logout } from "../redux/reducers/auth-reducer";

export const api = axios.create({
  baseURL: "http://localhost:5114", 
  timeout: 10000
});
export const apiPrivate = axios.create({
  baseURL: "http://localhost:5114",
  timeout: 10000,
  withCredentials: true, // критично для отримання cookie
});
// Автоматичні повтори запитів при помилках
axiosRetry(api, {
  retries: 3, // кількість повторів
  retryDelay: (retryCount) => retryCount * 500, 
  retryCondition: (error) => {
    
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error.message);
    return Promise.reject(error);
  }
);


export const fetchPasswordsByType = async (type) => {
  const endpoint = passwordUrls[type];
  if (!endpoint) {
    throw new Error(`No password URL defined for menu "${type}"`);
  }

  const { data } = await apiPrivate.get(endpoint);

  return data.reduce((acc, item) => {
    acc[item.id] = item.password;
  
    return acc;
  }, {});
};

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