import axios from "axios";
import axiosRetry from "axios-retry";
import { passwordUrls} from "./urls";
import { changeOrderUrl } from "./urls";
import { current } from "@reduxjs/toolkit";

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

export const changeOrderOfDisplayElements = async (
  elements,
  menu,
  depId,
  currentMode
) => {

  const dataToPush = elements.map(el => ({
    id: el.id,
    priority: el.priority
  }));

  const sendUrl = changeOrderUrl(menu);

  // 🔥 phones special case
  if (menu === "phones") {

    const payload = {
      items: dataToPush,
      mode: currentMode,
    };

    if (depId) {
      payload.depId = depId;
    }

    return api.post(sendUrl, payload);
  }

  // 🔥 everything else stays SAME AS BEFORE
  return api.post(sendUrl, dataToPush);
};
