import axios from "axios";
import axiosRetry from "axios-retry";
import { passwordUrls } from "./urls";

export const api = axios.create({
  baseURL: "http://localhost:5114", 
  timeout: 10000 
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


