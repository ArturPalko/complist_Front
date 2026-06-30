import axios from "axios";
import axiosRetry from "axios-retry";
import { dictionariesUrl, passwordUrls} from "./urls";
import { changeOrderUrl } from "./urls";
import { positionsUrl } from "./urls";
import { current } from "@reduxjs/toolkit";
import { setDictionaries } from "../redux/reducers/data-reducer/data-reducer";

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



export const fetchDictionariesThunk = () => async (dispatch) => {
 // dispatch(toggleDataIsFetchingActionCreator(true, "dictionaries"));
////debugger
  try {
    const { data } = await api.get(dictionariesUrl);
//debugger
    dispatch(setDictionaries({
      positions: data.positions,
      userTypes: data.userTypes,
      departments: data.departments,
      phones:data.phonesResult
    }));

   // dispatch(setDataIsLoadedActionCreator(true, "dictionaries"));

  } catch (err) {
    console.error("Dictionaries error:", err.message);
    throw err;

  } finally {
 //   dispatch(toggleDataIsFetchingActionCreator(false, "dictionaries"));
  }
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
debugger
    return api.post(sendUrl, payload);
  }

  // 🔥 everything else stays SAME AS BEFORE
  return api.post(sendUrl, dataToPush);
};


// export const addPosition = async (name) => {
//   const payload = {
//     name,
//   };
// //debugger
//   return api.post("/api/positions", payload);
// };

export const apiAddEntity = (endpoint, payload) => {
  debugger
  return api.post(`/api/${endpoint}`, payload);
};
// export const deletePosition = async (id) => {
//   return api.delete(`/api/positions/${id}`);
// };


// export const editPosition = async ({id, name, priority}) => {
//   //debugger
//   return api.put(`/api/positions/${id}`, {
//     name,
//     priority,
//   });
// };

export const apiEditEntity = (endpoint, { id, ...data }) => {
  debugger
  return api.put(`/api/${endpoint}/${id}`, data);
};

// export const deletePosition = async (ids) => {
//   return api.post("/api/positions/delete", ids);
// };



export const apiDeleteEntity = (endpoint, ids) => {
  debugger
  return api.post(`/api/${endpoint}/delete`, ids);
};
